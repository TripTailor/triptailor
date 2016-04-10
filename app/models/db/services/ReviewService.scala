package models.db.services

import models.db.schema.Tables
import play.api.db.slick.DatabaseConfigProvider
import slick.driver.JdbcProfile

import scala.concurrent.Future

trait ReviewService {
  import Tables._
  def retrieveRelevantReviews(hostelIds: Seq[Int], tags: Seq[String]): Future[Seq[ReviewRow]]
}

class ReviewServiceImpl(dbConfigProvider: DatabaseConfigProvider) extends ReviewService {
  import Tables._

  val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig.driver.api._

  def retrieveRelevantReviews(hostelIds: Seq[Int], tags: Seq[String]): Future[Seq[ReviewRow]] =
    dbConfig.db.run(reviewsAction(hostelIds, tags))

  private def reviewsAction(hostelIds: Seq[Int], tags: Seq[String]) = {
    val action =
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
        ORDER BY (review.sentiments->>max_sentence_nbr)::int desc;
      """.as[ReviewRow]
    println(action.statements mkString "\n")
    action
  }

}