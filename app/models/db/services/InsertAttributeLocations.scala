package models.db.services

import java.io.FileInputStream

import com.typesafe.config.ConfigFactory
import play.api.libs.json.{JsValue, Json}
import slick.backend.DatabaseConfig

import collection.mutable.{Map => MMap}
import scala.concurrent.Await
import scala.concurrent.duration.DurationInt

class InsertAttributeLocations {
  import models.db.schema.Tables._

  implicit val ec = scala.concurrent.ExecutionContext.Implicits.global

  val triptailor =
    DatabaseConfig.forConfig[db.drivers.ExtendedPostgresDriver]("slick.dbs.default", ConfigFactory.load)

  import triptailor.driver.api._

  def insertAttributeLocations(): Unit = {
    for (locationId <- 1 to 25) {
      val json = readJson(locationId)
      val map  = groupByTag(json)
      buildAttributeLocationActions(locationId, map).foreach { action =>
        Await.result(triptailor.db.run(action), 3.seconds)
      }
    }

  }

  def buildAttributeLocationActions(locationId: Int, map: MMap[String,Double]) = {
    def retrieveAttributeIdAction(tag: String) =
      Attribute.filter(_.name === tag).map(_.id).result.head

    map.map { case (tag, maxRating) =>
      retrieveAttributeIdAction(tag).flatMap { aid =>
        AttributeLocation += AttributeLocationRow(aid, locationId, maxRating)
      }
    }
  }

  def groupByTag(json: JsValue): MMap[String,Double] =
    json.as[Stream[JsValue]].foldLeft(MMap.empty[String,Double]) { case (map, nxt) =>
      (nxt \ "ctags").as[Seq[JsValue]].foreach { ctag =>
        val tag    = (ctag \ "name").as[String]
        val rating = (ctag \ "rating").as[Double]
        map += tag -> math.max(map.getOrElse(tag, 0d), rating)
      }
      map
    }

  def readJson(locationId: Int): JsValue =
    Json.parse(new FileInputStream(s"requests/classify_all_$locationId.json"))

}