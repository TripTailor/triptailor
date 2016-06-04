package services

import controllers.api.ApiDomain.{ClassifiedDocument, ClassifiedTag, RatedDocument, RatingMetrics}

class ClassificationService[A]
                           (m: Seq[RatedDocument[A]],
                            b: Double,
                            ratingConstant: Double,
                            tags: Seq[String],
                            service: StopWordsFilterService) {
  import extensions._
  import ClassificationService._

  def classify: Seq[ClassifiedDocument[A]] = {
    val avgdl = compute_avgdl(tags)
    for {
      d      ← m
      dl     = compute_dl(d)
      ctags  = classifyDocTags(d, dl, avgdl)
      rating = ctags.sumBy(_.rating)
    } yield ClassifiedDocument(d, ctags, rating)
  }.sorted

  private def classifyDocTags(d: RatedDocument[A], dl: Double, avgdl: Double): Seq[ClassifiedTag] = {
    def unratedCtag(tag: String) =
      ClassifiedTag(name = tag, rating = 0, scaledRating = 0)

    def ratedCtag(tag: String)(metrics: RatingMetrics) = {
      val rating = (metrics.cfreq * metrics.sentiment / metrics.freq) / (1 - b + b * (dl / avgdl))
      ClassifiedTag(
        name         = tag,
        rating       = rating,
        scaledRating = Math.log(ratingConstant * (rating + 1))
      )
    }

    def toCtag(tag: String) =
      d.metrics.get(tag).fold(unratedCtag(tag))(ratedCtag(tag))

    tags.map(toCtag)
  }

  private def compute_avgdl(tags: Seq[String]): Double =
    m.sumBy(compute_dl) / m.size

  private def compute_dl(d: RatedDocument[A]): Double =
    d.metrics.sumByCond(_._2.freq)(metrics => service.stopWords(metrics._1))

}

object ClassificationService {
  implicit def ascendingDocRating[A]: Ordering[ClassifiedDocument[A]] =
    Ordering.by[ClassifiedDocument[A], Double](-_.rating)
}
