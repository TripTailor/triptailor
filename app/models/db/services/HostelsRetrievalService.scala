package models.db.services

import controllers.api.ApiDomain.{RatedDocument, RatingMetrics}
import models.db.schema.Tables
import play.api.db.slick.DatabaseConfigProvider
import slick.driver.JdbcProfile

import scala.concurrent.Future

trait HostelsRetrievalService {
  import Tables._
  def retrieveHostelsModel(locationId: Int): Future[Seq[RatedDocument[HostelRow]]]
}

class HostelsRetrievalServiceImpl(dbConfigProvider: DatabaseConfigProvider) extends HostelsRetrievalService {
  import scala.concurrent.ExecutionContext.Implicits.global
  import Tables._

  val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig.driver.api._

  def retrieveHostelsModel(locationId: Int): Future[Seq[RatedDocument[HostelRow]]] =
    dbConfig.db.run(loadHostelsComponentsQuery(locationId).result.map(buildHostelDocuments))

  private def buildHostelDocuments(rows: Seq[HostelDocumentComponent]): Seq[RatedDocument[HostelRow]] = {
    @annotation.tailrec
    def buildDocument(res: RatedDocument[HostelRow])(nxt: Seq[HostelDocumentComponent]): RatedDocument[HostelRow] =
      if (nxt.isEmpty)
        res
      else {
        val comp = nxt.head
        val h    = comp.h
        val a    = comp.a
        val ha   = comp.ha
        if (nxt.isEmpty)
          res
        else if (res == null)
          buildDocument(RatedDocument(h, Map(a.name -> RatingMetrics(ha.rating, ha.freq, ha.cfreq))))(nxt.tail)
        else
          buildDocument(res.copy(metrics = res.metrics.updated(a.name, RatingMetrics(ha.rating, ha.freq, ha.cfreq))))(nxt.tail)
      }
    rows.groupBy(_.h.id).values.map(buildDocument(null)).toSeq
  }

  private def loadHostelsComponentsQuery(locationId: Int) =
    for {
      l  ← Location         if l.id === locationId
      h  ← Hostel           if h.locationId === l.id
      ha ← HostelAttribute  if ha.hostelId === h.id
      a  ← Attribute        if a.id === ha.attributeId
    } yield (h, a, ha) <> (HostelDocumentComponent.tupled, HostelDocumentComponent.unapply)

  private[this] case class HostelDocumentComponent(h: HostelRow, a: AttributeRow, ha: HostelAttributeRow)
}