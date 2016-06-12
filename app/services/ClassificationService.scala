package services

import controllers.api.ApiDomain._

class ClassificationService[A]
                           (m: Seq[RatedDocument[A]],
                            b: Double,
                            service: StopWordsFilterService) {
  import extensions._
  import ClassificationService._

  def classifyAll: Seq[ClassifiedDocument[A]] = {
    val tags = m.foldLeft(Set.empty[String])(_ ++ _.metrics.keySet).toSeq
    classify(tags)
  }

  def classify(tags: Seq[String]): Seq[ClassifiedDocument[A]] = {
    val avgdl = compute_avgdl(tags)
    for {
      d      ← m
      dl     = compute_dl(d)
      ctags  = classifyDocTags(d, tags, dl, avgdl)
      rating = ctags.sumBy(_.rating)
    } yield ClassifiedDocument(d, ctags, rating)
  }.sorted

  private def classifyDocTags(d: RatedDocument[A], tags: Seq[String], dl: Double, avgdl: Double): Seq[ClassifiedTag] = {
    def unratedCtag(tag: String) =
      ClassifiedTag(name = tag, rating = 0, scaledRating = 0)

    def ratedCtag(tag: String)(metrics: RatingMetricsWithMaxRating) = {
      val rating = (metrics.m.cfreq * metrics.m.sentiment / metrics.m.freq) / (1 - b + b * (dl / avgdl))
      ClassifiedTag(
        name         = tag,
        rating       = rating,
        scaledRating = Math.pow(metrics.maxRating * rating, 1d / 3d)
      )
    }

    def toCtag(tag: String) =
      d.metrics.get(tag).fold(unratedCtag(tag))(ratedCtag(tag))

    tags.map(toCtag)
  }

  private def compute_avgdl(tags: Seq[String]): Double =
    m.sumBy(compute_dl) / m.size

  private def compute_dl(d: RatedDocument[A]): Double =
    d.metrics.sumByCond(_._2.m.freq)(metrics => !service.stopWords(metrics._1))

}

object ClassificationService {
  implicit def ascendingDocRating[A]: Ordering[ClassifiedDocument[A]] =
    Ordering.by[ClassifiedDocument[A], Double](-_.rating)
}
