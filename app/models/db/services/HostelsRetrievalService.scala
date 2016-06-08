package models.db.services

import controllers.api.ApiDomain.{RatedDocument, RatingMetrics}
import models.db.schema.Tables
import play.api.db.slick.DatabaseConfigProvider
import slick.driver.JdbcProfile

import scala.concurrent.Future

trait HostelsRetrievalService {
  import Tables._
  def retrieveHostelsModel(locationId: Int): Future[Seq[RatedDocument[HostelRow]]]
  def retrieveHostelReviews(hostelId: Int): Future[Seq[ReviewRow]]
}

class HostelsRetrievalServiceImpl(dbConfigProvider: DatabaseConfigProvider) extends HostelsRetrievalService {
  import scala.concurrent.ExecutionContext.Implicits.global
  import Tables._

  private val defaultYear = new java.sql.Date(Integer.MIN_VALUE)
  val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig.driver.api._

  def retrieveHostelsModel(locationId: Int): Future[Seq[RatedDocument[HostelRow]]] =
    dbConfig.db.run {
      for {
        hs   ← loadHostelsQuery(locationId).result
        docs ← DBIO.sequence(hs.map(h => loadHostelAttributesQuery(h.id).result.map(buildHostelDocument(h))))
      } yield docs
    }

  // TODO: Define implicit slick.lifted.Rep[java.sql.Date] => slick.lifted.Ordered
  def retrieveHostelReviews(hostelId: Int): Future[Seq[ReviewRow]] =
    dbConfig.db.run(
      loadHostelReviewsQuery(hostelId)
        .sortBy(_.year.getOrElse(defaultYear))
        .take(150)
        .result
    ).map(reverseReviews)

  /** Slick Query[T] returning methods **/
  private def loadHostelsQuery(locationId: Int) =
    for {
      l ← Location if l.id === locationId
      h ← Hostel   if l.id === h.locationId
    } yield h

  private def loadHostelAttributesQuery(hostelId: Int) =
    for {
      ha      ← HostelAttribute                if ha.hostelId === hostelId
      a       ← Attribute                      if a.id        === ha.attributeId
      metrics = (ha.rating, ha.freq, ha.cfreq) <> (RatingMetrics.tupled, RatingMetrics.unapply)
    } yield (a.name, metrics) <> (HostelAttributeComponent.tupled, HostelAttributeComponent.unapply)

  private def loadHostelReviewsQuery(hostelId: Int) =
    for {
      h ← Hostel if h.id === hostelId
      r ← Review if r.hostelId === h.id
    } yield r
  /** End of Slick Query[T] returning methods **/

  /** Slick DBIOAction composers **/
  private def buildHostelDocument(h: HostelRow)(components: Seq[HostelAttributeComponent]) = {
    @annotation.tailrec
    def buildDocument(res: RatedDocument[HostelRow])(nxt: Seq[HostelAttributeComponent]): RatedDocument[HostelRow] =
      if (nxt.isEmpty)
        res
      else {
        val comp = nxt.head
        buildDocument(res.copy(metrics = res.metrics.updated(comp.name, comp.metrics)))(nxt.tail)
      }

    buildDocument(RatedDocument(h, Map()))(components)
  }

  private def reverseReviews(rows: Seq[ReviewRow]) = rows.reverse
  /** End of Slick DBIOAction composers **/

  private[this] case class HostelAttributeComponent(name: String, metrics: RatingMetrics)

}