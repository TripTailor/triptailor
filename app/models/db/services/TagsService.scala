package models.db.services

import models.db.schema.Tables
import play.api.db.slick.DatabaseConfigProvider
import slick.driver.JdbcProfile

import scala.concurrent.Future

trait TagsService {
  import Tables._
  def retrieveMostCommonTags(locationId: Int): Future[Seq[AttributeRow]]
}

class TagsServiceImpl(dbConfigProvider: DatabaseConfigProvider) extends TagsService {
  import Tables._

  val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig.driver.api._

  def retrieveMostCommonTags(locationId: Int): Future[Seq[AttributeRow]] =
    dbConfig.db.run(retrieveMostCommonTagsAction(locationId))

  // TODO: Maybe add list of excluded tags
  private def retrieveMostCommonTagsAction(locationId: Int) =
    sql"""
       SELECT id, name
         FROM (SELECT id, name, ROW_NUMBER() OVER (PARTITION BY name ORDER BY freq DESC) AS rn
           FROM (SELECT a.id, a.name, count(*) as freq
           FROM location l, hostel h, hostel_attribute ha, attribute a
           WHERE l.id = h.location_id
           AND ha.hostel_id = h.id
           AND ha.attribute_id = a.id
           AND l.id = 1
           GROUP BY 1) attr_freq) ranked_attrs
       WHERE rn = 1
       LIMIT 30
    """.as[AttributeRow]
}