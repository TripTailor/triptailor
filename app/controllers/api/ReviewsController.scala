package controllers.api

import javax.inject.{Inject, Singleton}

import models.db.services.{ReviewService, ReviewServiceImpl}
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.json._
import play.api.mvc.Action

import scala.concurrent.ExecutionContext

// TODO: Inject ReviewsServiceImpl
@Singleton
class ReviewsController @Inject()(dbConfig: DatabaseConfigProvider)(implicit ec: ExecutionContext)
    extends BaseApiController {

  private val service: ReviewService = new ReviewServiceImpl(dbConfig)

  def retrieveReviews = Action.async { implicit request =>
    reviewServiceParams.bindFromRequest.fold(
      hasErrors = incorrectServiceCall,
      success   = invokeService
    )
  }

  private def invokeService(params: ReviewServiceParams) =
    service.retrieveRelevantReviews(params.hostelIds, params.tags).map(Json.toJson(_)).map(Ok(_))

}