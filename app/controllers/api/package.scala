package controllers

import models.db.schema.Tables._
import controllers.api.ApiDomain._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.functional.syntax._
import play.api.libs.json._

package object api {

  /** API param mappings **/
  private[api] case class QueryTextParams(q: String)
  private[api] val queryTextParams = Form(
    mapping("q" -> nonEmptyText)(QueryTextParams.apply)(QueryTextParams.unapply)
  )

  private[api] case class ReviewServiceParams(hostelIds: List[Int], tags: List[String])
  private[api] val reviewServiceParams = Form(
    mapping(
      "hostel_ids" -> list(number),
      "tags"       -> list(nonEmptyText)
    )(ReviewServiceParams.apply)(ReviewServiceParams.unapply)
  )

  private[api] case class RecordIdParams(recordId: Int)
  private[api] val recordIdParams = Form(
    mapping("id" -> number)(RecordIdParams.apply)(RecordIdParams.unapply)
  )

  private[api] case class ClassificationParams(locationId: Int, tags: List[String])
  private[api] val classificationParams = Form(
    mapping(
      "locationId" -> number,
      "tags"       -> list(nonEmptyText)
    )(ClassificationParams.apply)(ClassificationParams.unapply)
  )
  /** End of API params mappings **/

 /** API JSON writers **/
  private[api] implicit val reviewWrites: Writes[ReviewRow] =
    (
      (__ \ "id").write[Int] and
      (__ \ "hostelId").write[Int] and
      (__ \ "text").write[String] and
      (__ \ "year").writeNullable[java.sql.Date] and
      (__ \ "reviewer").writeNullable[String] and
      (__ \ "city").writeNullable[String] and
      (__ \ "gender").writeNullable[String] and
      (__ \ "age").writeNullable[Int] and
      (__ \ "sentiment").writeNullable[String] and
      (__ \ "lat").writeNullable[Short] and
      (__ \ "long").writeNullable[Short] and
      (__ \ "sentiments").writeNullable[JsValue] and
      (__ \ "attribute").writeNullable[JsValue]
    )(unlift(ReviewRow.unapply))

  private[api] implicit val locationWrites: Writes[LocationRow] =
    (
      (__ \ "id").write[Int] and
      (__ \ "city").write[String] and
      (__ \ "country").write[String] and
      (__ \ "state").writeNullable[String] and
      (__ \ "region").writeNullable[String] and
      (__ \ "continent").writeNullable[String]
    )(unlift(LocationRow.unapply))

  private[api] implicit val hostelWrites: Writes[HostelRow] =
    (
      (__ \ "hotelId").write[Int] and
      (__ \ "name").write[String] and
      (__ \ "description").writeNullable[String] and
      (__ \ "price").writeNullable[Double] and
      (__ \ "images").writeNullable[String] and
      (__ \ "url").writeNullable[String] and
      (__ \ "noReviews").write[Int] and
      (__ \ "locationId").write[Int] and
      (__ \ "hostelWorldId").writeNullable[Int] and
      (__ \ "address").writeNullable[String]
    )(unlift(HostelRow.unapply))

  private[api] implicit val ratingMetricsWrite: Writes[RatingMetrics] =
    (
      (__ \ "sentiment").write[Double] and
      (__ \ "freq").write[Double] and
      (__ \ "cfreq").write[Double]
    )(unlift(RatingMetrics.unapply))

  private[api] implicit def ratedDocumentWrites[A: Writes]: Writes[RatedDocument[A]] =
    new Writes[RatedDocument[A]] {
      def writes(rd: RatedDocument[A]): JsValue =
        Json.obj(
          "model"   -> rd.model,
          "metrics" -> rd.metrics
        )
    }

  private[api] implicit val classifiedTagWrites: Writes[ClassifiedTag] =
    (
      (__ \ "name").write[String] and
      (__ \ "rating").write[Double]
    )(unlift(ClassifiedTag.unapply))

  private[api] implicit def hostelDocumentWrites[A: Writes]: Writes[ClassifiedDocument[A]] =
    new Writes[ClassifiedDocument[A]] {
      def writes(cd: ClassifiedDocument[A]): JsValue =
        Json.obj(
          "document" -> cd.doc,
          "ctags"    -> cd.ctags
        )
    }
  /** End of API JSON writers **/

}