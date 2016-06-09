package controllers.api

object ApiDomain {
  import models.db.schema.Tables._

  case class ClassifiedDocument[A](doc: RatedDocument[A], ctags: Seq[ClassifiedTag], rating: Double)
  case class ClassifiedTag(name: String, rating: Double, scaledRating: Double)

  case class RatedDocument[A](model: A, metrics: Map[String, RatingMetrics])
  case class RatingMetrics(sentiment: Double, freq: Double, cfreq: Double)

  case class SearchReviews(hostelId: Int, reviews: Seq[ReviewRow])
}
