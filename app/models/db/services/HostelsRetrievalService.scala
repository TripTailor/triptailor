package models.db.services

import javax.inject.{Inject, Singleton}

import controllers.api.ApiDomain.{RatedDocument, RatingMetrics, RatingMetricsWithMaxRating}
import models.db.schema.Tables
import play.api.db.slick.DatabaseConfigProvider
import slick.driver.JdbcProfile

import scala.concurrent.Future

trait HostelsRetrievalService {
  import Tables._
  def retrieveHostelsModel(locationId: Int): Future[Seq[RatedDocument[HostelRow]]]
  def retrieveHostelReviews(hostelId: Int): Future[Seq[ReviewRow]]
}

@Singleton
class HostelsRetrievalServiceImpl @Inject()(dbConfigProvider: DatabaseConfigProvider) extends HostelsRetrievalService {
  import Tables._

  import scala.concurrent.ExecutionContext.Implicits.global

  private val defaultYear = new java.sql.Date(Integer.MIN_VALUE)
  val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig.driver.api._

  def retrieveHostelsModel(locationId: Int): Future[Seq[RatedDocument[HostelRow]]] =
    dbConfig.db.run {
      for {
        als  ← loadLocationAttributesQuery(locationId).result.map(groupLocationAttributes)
        hs   ← loadHostelsQuery(locationId).result
        docs ← DBIO.sequence(hs.map(h => loadHostelAttributesQuery(h.id).result.map(buildHostelDocument(h, als))))
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

  private def loadLocationAttributesQuery(locationId: Int) =
    for {
      al ← AttributeLocation if al.locationId === locationId
    } yield al

  private def loadHostelAttributesQuery(hostelId: Int) =
    for {
      ha      ← HostelAttribute                if ha.hostelId === hostelId
      a       ← Attribute                      if a.id        === ha.attributeId
      metrics = (ha.rating, ha.freq, ha.cfreq) <> (RatingMetrics.tupled, RatingMetrics.unapply)
    } yield (a.id, a.name, metrics) <> (HostelAttributeComponent.tupled, HostelAttributeComponent.unapply)

  private def loadHostelReviewsQuery(hostelId: Int) =
    for {
      h ← Hostel if h.id === hostelId
      r ← Review if r.hostelId === h.id
    } yield r
  /** End of Slick Query[T] returning methods **/

  /** Slick DBIOAction composers **/
  private def buildHostelDocument(h: HostelRow, locationAttributes: Map[Int,Double])
                                 (components: Seq[HostelAttributeComponent]) = {
    @annotation.tailrec
    def buildDocument(res: RatedDocument[HostelRow])(nxt: Seq[HostelAttributeComponent]): RatedDocument[HostelRow] =
      if (nxt.isEmpty)
        res
      else {
        val comp = nxt.head
        val metrics = res.metrics.updated(comp.name, RatingMetricsWithMaxRating(comp.metrics, locationAttributes(comp.id)))
        buildDocument(res.copy(metrics = metrics))(nxt.tail)
      }

    buildDocument(RatedDocument(h, Map()))(components)
  }

  private def groupLocationAttributes(al: Seq[AttributeLocationRow]) =
    al.groupBy(_.attributeId).mapValues(_.head.locationRating)

  private def reverseReviews(rows: Seq[ReviewRow]) = rows.reverse
  /** End of Slick DBIOAction composers **/

  private[this] case class HostelAttributeComponent(id: Int, name: String, metrics: RatingMetrics)

}