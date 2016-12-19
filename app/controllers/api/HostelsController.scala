package controllers.api

import javax.inject.{Inject, Singleton}

import models.db.services.HostelsRetrievalService
import play.api.Configuration
import play.api.libs.json.Json
import play.api.mvc.Action
import services.{ClassificationService, StopWordsFilterService}

import scala.concurrent.ExecutionContext

@Singleton
class HostelsController @Inject()(conf: Configuration,
                                  hostelsRetrievalService: HostelsRetrievalService,
                                  stopWordsService: StopWordsFilterService)
                                 (implicit ec: ExecutionContext) extends BaseApiController {

  def classify = Action.async { implicit request =>
    classificationParams.bindFromRequest.fold(
      hasErrors = incorrectServiceCall,
      success   = invokeClassifyService
    )
  }

  def classifyAll = Action.async { implicit request =>
    recordIdParams.bindFromRequest.fold(
      hasErrors = incorrectServiceCall,
      success   = invokeClassifyAllService
    )
  }

  def retrieveReviews = Action.async { implicit request =>
    recordIdParams.bindFromRequest.fold(
      hasErrors = incorrectServiceCall,
      success   = invokeHostelReviewsService
    )
  }

  private def invokeClassifyService(params: ClassificationParams) = {
    val classifiedDocs =
      for {
        ratedDocs  ← hostelsRetrievalService.retrieveHostelsModel(params.locationId)
        classifier = {
          new ClassificationService(
            ratedDocs,
            conf.getDouble("classification.b").get,
            stopWordsService
          )
        }
      } yield classifier.classify(params.tags)

    classifiedDocs.map(Json.toJson(_)).map(Ok(_))
  }

  private def invokeClassifyAllService(params: RecordIdParams) = {
    val classifiedDocs =
      for {
        ratedDocs  ← hostelsRetrievalService.retrieveHostelsModel(params.recordId)
        classifier = {
          new ClassificationService(
            ratedDocs,
            conf.getDouble("classification.b").get,
            stopWordsService
          )
        }
      } yield classifier.classifyAll

    classifiedDocs.map(Json.toJson(_)).map(Ok(_))
  }

  private def invokeHostelReviewsService(params: RecordIdParams) =
    hostelsRetrievalService.retrieveHostelReviews(params.recordId).map(Json.toJson(_)).map(Ok(_))

}