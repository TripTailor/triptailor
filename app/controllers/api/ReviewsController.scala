package controllers.api

import javax.inject.{Inject, Singleton}

import models.db.services.ReviewService
import play.api.libs.json._
import play.api.mvc.Action

import scala.concurrent.ExecutionContext

@Singleton
class ReviewsController @Inject()(reviewService: ReviewService)(implicit ec: ExecutionContext)
    extends BaseApiController {

  def retrieveReviews = Action.async { implicit request =>
    reviewServiceParams.bindFromRequest.fold(
      hasErrors = incorrectServiceCall,
      success   = invokeService
    )
  }

  private def invokeService(params: ReviewServiceParams) =
    reviewService.retrieveRelevantReviews(params.hostelIds, params.tags).map(Json.toJson(_)).map(Ok(_))

}