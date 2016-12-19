package models.db.services

import javax.inject.{Inject, Singleton}

import models.db.schema.Tables
import play.api.db.slick.DatabaseConfigProvider
import services.StopWordsFilterService
import slick.driver.JdbcProfile

import scala.concurrent.Future

trait TagsService {
  import Tables._
  def retrieveMostCommonTags(locationId: Int): Future[Seq[AttributeRow]]
}

@Singleton
class TagsServiceImpl @Inject()(dbConfigProvider: DatabaseConfigProvider, stopWordService: StopWordsFilterService)
    extends TagsService {

  import Tables._

  val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig.driver.api._
  
  val stopWords = stopWordService.quotedStopWordsString

  def retrieveMostCommonTags(locationId: Int): Future[Seq[AttributeRow]] =
    dbConfig.db.run(retrieveMostCommonTagsAction(locationId))

  // TODO: Maybe add list of excluded tags
  private def retrieveMostCommonTagsAction(locationId: Int) =
    sql"""
        SELECT  a.id, a.name
          FROM  location l, hostel h, hostel_attribute ha, attribute a
         WHERE  l.id = h.location_id
           AND  ha.hostel_id = h.id
           AND  ha.attribute_id = a.id
           AND  l.id = $locationId
           AND  a.name NOT IN (#$stopWords)
      GROUP BY  a.id
      ORDER BY  SUM(ha.freq) DESC
      LIMIT 45;
    """.as[AttributeRow]
}