package models.db.services

import javax.inject.{Inject, Singleton}

import models.db.schema.Tables
import play.api.db.slick.DatabaseConfigProvider
import slick.driver.JdbcProfile

import scala.concurrent.{ExecutionContext, Future}

trait ReviewService {
  import Tables._
  def retrieveRelevantReviews(hostelIds: Seq[Int], tags: Seq[String]): Future[Map[String,Seq[ReviewRow]]]
}

trait FilterAttributesFromReview {
  import play.api.libs.json._
  import collection.mutable
  import Tables._

  def filterAttributesFromTags(tags: Set[String])(attributes: JsValue): JsValue =
    JsArray(attributes.as[Seq[JsValue]].filter(attribute => tags((attribute \ "attribute_name").as[String])))

  def trimReviews(tags: Set[String])(reviews: Seq[ReviewRow]) = {
    @annotation.tailrec
    def helper(tags: Set[String], remaining: Seq[ReviewRow], acc: mutable.ListBuffer[ReviewRow]): Seq[ReviewRow] = {
      if (tags.isEmpty || remaining.isEmpty)
        acc.toList
      else {
        val nxt = remaining.head
        val containing = nxt.attributes.fold(Set.empty[JsValue])(_.as[Set[JsValue]]).map(attribute => (attribute \ "attribute_name").as[String])
        helper(tags -- containing, remaining.tail, if ((tags intersect containing).isEmpty) acc else acc :+ nxt)
      }
    }
    helper(tags, reviews, mutable.ListBuffer())
  }
}

@Singleton
class ReviewServiceImpl @Inject()(dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext)
    extends ReviewService with FilterAttributesFromReview {
  import Tables._

  val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig.driver.api._

  def retrieveRelevantReviews(hostelIds: Seq[Int], tags: Seq[String]): Future[Map[String,Seq[ReviewRow]]] =
    dbConfig.db.run(reviewsAction(hostelIds, tags)
      .map(filterReviewsAttributes(tags.toSet)))
      .map(filterReviews(tags.toSet))

  def filterReviews(tags: Set[String])(reviews: Seq[ReviewRow]) =
    reviews.groupBy(_.hostelId).foldLeft(Map.empty[String,Seq[ReviewRow]]) { case (filtered, (id, reviews)) =>
      filtered.updated(id.toString, trimReviews(tags)(reviews))
    }

  private def filterReviewsAttributes(tags: Set[String])(reviews: Seq[ReviewRow]) = {
    def filterReviewAttributes(review: ReviewRow) =
      review.copy(attributes = review.attributes.map(filterAttributesFromTags(tags)))
    reviews.map(filterReviewAttributes)
  }

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
                WHERE review.hostel_id = ANY('{#${hostelIds.mkString(",")}}')
              ) attributes_proj
              WHERE review_attributes->>'attribute_name' = ANY('{#${tags.mkString(",")}}')
            ) _
          ) _
        GROUP BY id) max_sentiments ON review.id = max_sentiments.id
        WHERE review.hostel_id = ANY('{#${hostelIds.mkString(",")}}')
        ORDER BY review.hostel_id, (review.sentiments->>max_sentence_nbr)::int DESC;
      """.as[ReviewRow]

}
