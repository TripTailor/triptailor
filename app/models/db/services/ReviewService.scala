package models.db.services

import models.db.schema.Tables
import play.api.db.slick.DatabaseConfigProvider
import slick.driver.JdbcProfile
import controllers.api.ApiDomain.SearchReviews

import scala.concurrent.{ExecutionContext, Future}

trait ReviewService {
  import Tables._
  def retrieveRelevantReviews(hostelIds: Seq[Int], tags: Seq[String]): Future[Seq[SearchReviews]]
}

trait FilterAttributesFromReview {
  import play.api.libs.json._
  import Tables._

  def filterAttributesFromTags(tags: Set[String])(attributes: JsValue): JsValue =
    JsArray(attributes.as[Seq[JsValue]].filter(attribute => tags((attribute \ "attribute_name").as[String])))

  def trimSearchesReviews(tags: Set[String])(searchesReviews: Seq[SearchReviews]): Seq[SearchReviews] = {
    @annotation.tailrec
    def trimSearchReviews(hostelId: Int, tags: Set[String], remaining: Seq[ReviewRow], acc: Seq[ReviewRow]): SearchReviews = {
      if (tags.isEmpty || remaining.isEmpty)
        SearchReviews(hostelId, acc)
      else {
        val nxt = remaining.head
        val containing = nxt.attributes.fold(Set.empty[JsValue])(_.as[Set[JsValue]]).map(attribute => (attribute \ "attribute_name").as[String])
        trimSearchReviews(hostelId, tags -- containing, remaining.tail, acc :+ nxt)
      }
    }
    searchesReviews.map(srs => trimSearchReviews(srs.hostelId, tags, srs.reviews, Seq()))
  }
}

class ReviewServiceImpl(dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext)
    extends ReviewService with FilterAttributesFromReview {
  import Tables._

  val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig.driver.api._

  def retrieveRelevantReviews(hostelIds: Seq[Int], tags: Seq[String]): Future[Seq[SearchReviews]] =
    dbConfig.db.run(reviewsAction(hostelIds, tags)
      .map(filterReviewsAttributes(tags.toSet)))
      .map(structureApiResponse)
      .map(trimSearchesReviews(tags.toSet))

  private def filterReviewsAttributes(tags: Set[String])(reviews: Seq[ReviewRow]) = {
    def filterReviewAttributes(review: ReviewRow) =
      review.copy(attributes = review.attributes.map(filterAttributesFromTags(tags)))
    reviews.map(filterReviewAttributes)
  }

  private def structureApiResponse(reviews: Seq[ReviewRow]) =
    reviews.groupBy(_.hostelId).map { case (hostelId, reviews) =>
      SearchReviews(hostelId, reviews)
    }.toSeq


  private def reviewsAction(hostelIds: Seq[Int], tags: Seq[String]) =
    sql"""
        SELECT review.*
        FROM review
        INNER JOIN (
          SELECT id, max(sentence_nbr::int) as max_sentence_nbr
          FROM (
            SELECT id, jsonb_array_elements(review_attributes->'positions')->>'sentence' sentence_nbr
            FROM (
              SELECT id, review_attributes
              FROM (
                SELECT id, jsonb_array_elements(attributes) review_attributes
                FROM review
              ) attributes_proj
              WHERE review_attributes->>'attribute_name' = ANY('{#${tags.mkString(",")}}')
            ) _
          ) _
        GROUP BY id) max_sentiments ON review.id = max_sentiments.id
        WHERE review.hostel_id = ANY('{#${hostelIds.mkString(",")}}')
        ORDER BY review.hostel_id, (review.sentiments->>max_sentence_nbr)::int DESC;
      """.as[ReviewRow]

}
