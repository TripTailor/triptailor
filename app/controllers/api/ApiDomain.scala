package controllers.api

object ApiDomain {
  case class ClassifiedDocument[A](doc: RatedDocument[A], ctags: Seq[ClassifiedTag], rating: Double)
  case class ClassifiedTag(name: String, rating: Double)

  case class RatedDocument[A](model: A, reviews: Seq[RatedReview], metrics: Map[String, RatingMetrics])
  case class RatedReview(text: String, metrics: Map[String, RatingMetrics])
  case class RatingMetrics(sentiment: Double, freq: Double, cfreq: Double)
}