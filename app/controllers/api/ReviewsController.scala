package controllers.api

import javax.inject.{Inject, Singleton}

import models.db.services.{ReviewService, ReviewServiceImpl}
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.json._
import play.api.mvc.{Action, Controller}

import scala.concurrent.ExecutionContext



// TODO: Inject ReviewsServiceImpl
@Singleton
class ReviewsController @Inject()(dbConfig: DatabaseConfigProvider)(implicit ec: ExecutionContext) extends Controller {

  def retrieveReviews = Action.async { implicit request =>
    // TODO: Validate well formed requests
    val params = reviewServiceParams.bindFromRequest().get

    val service: ReviewService = new ReviewServiceImpl(dbConfig)
    service.retrieveRelevantReviews(params.hostelIds.toSeq, params.tags.toSeq).map(Json.toJson(_)).map(Ok(_))
  }

}