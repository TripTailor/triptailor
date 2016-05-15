package models.db.services

import models.db.schema.Tables
import play.api.db.slick.DatabaseConfigProvider
import slick.driver.JdbcProfile

import scala.concurrent.Future


trait LocationHintsService {
  import Tables._
  def retrieveLocationHints(query: String): Future[Seq[LocationRow]]
}

class LocationHintsServiceImpl(dbConfigProvider: DatabaseConfigProvider) extends LocationHintsService {
  import Tables._

  val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig.driver.api._

  def retrieveLocationHints(query: String): Future[Seq[LocationRow]] =
    dbConfig.db.run(locationsAction(query))

  private def locationsAction(query: String) =
    locationsQuery(query).take(10).result

  private def locationsQuery(query: String) = {
    val sanitized = s"${query.trim.toLowerCase}%"
    for {
      l ← Location
      if (l.city.toLowerCase like sanitized) || (l.country.toLowerCase like sanitized)
    } yield l
  }
}