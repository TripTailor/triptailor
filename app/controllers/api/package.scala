package controllers

import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.functional.syntax._
import play.api.libs.json._

package object api {

  /** API param mappings **/
  private[api] case class ReviewServiceParams(hostelIds: List[Int], tags: List[String])

  private[api] val reviewServiceParams = Form(
    mapping(
      "hostel_ids" -> list(number),
      "tags"       -> list(nonEmptyText)
    )(ReviewServiceParams.apply)(ReviewServiceParams.unapply)
  )

  private[api] implicit val reviewWrites: Writes[models.db.schema.Tables.ReviewRow] =
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
    )(unlift(models.db.schema.Tables.ReviewRow.unapply))

}