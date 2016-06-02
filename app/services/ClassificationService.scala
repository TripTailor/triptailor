package services

import controllers.api.ApiDomain.{ClassifiedDocument, ClassifiedTag, RatedDocument}

class ClassificationService[A](m: Seq[RatedDocument[A]], b: Double, ratingConstant: Double, tags: Seq[String]) {
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

  private def classifyDocTags(d: RatedDocument[A], dl: Double, avgdl: Double): Seq[ClassifiedTag] =
    d.metrics.collect {
      case (tag, metrics) if tags contains tag => {
        val rating = (metrics.cfreq * metrics.sentiment / metrics.freq) / (1 - b + b * (dl / avgdl))
        ClassifiedTag(
          name   = tag,
          rating = rating,
          scaledRating = Math.log(ratingConstant * (rating + 1))
        )
      }
    }.toSeq

  private def compute_avgdl(tags: Seq[String]): Double =
    m.sumBy(compute_dl) / m.size

  private def compute_dl(d: RatedDocument[A]): Double =
    d.metrics.sumBy(_._2.freq)

}

object ClassificationService {
  implicit def ascendingDocRating[A]: Ordering[ClassifiedDocument[A]] =
    Ordering.by[ClassifiedDocument[A], Double](-_.rating)
}