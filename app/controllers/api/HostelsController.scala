package controllers.api

import javax.inject.{Inject, Singleton}

import controllers.api.ApiDomain.ClassifiedDocument
import models.db.schema.Tables
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

  type H = Tables.HostelRow

  def classify = Action.async { implicit request =>
    classificationParams.bindFromRequest.fold(
      hasErrors = incorrectServiceCall,
      success   = params => invokeClassificationService(params.locationId)(_.classify(params.tags))
    )

  }

  def classifyAll = Action.async { implicit request =>
    recordIdParams.bindFromRequest.fold(
      hasErrors = incorrectServiceCall,
      success   = params => invokeClassificationService(params.recordId)(_.classifyAll)
    )
  }

  def retrieveReviews = Action.async { implicit request =>
    recordIdParams.bindFromRequest.fold(
      hasErrors = incorrectServiceCall,
      success   = invokeHostelReviewsService
    )
  }

  private def invokeClassificationService(recordId: Int)
                                         (classify: ClassificationService[H] => Seq[ClassifiedDocument[H]]) = {
    val classifiedDocs =
      for {
        ratedDocs  ← hostelsRetrievalService.retrieveHostelsModel(recordId)
        classifier =
          new ClassificationService(
            ratedDocs,
            conf.getDouble("classification.b").get,
            stopWordsService
          )
      } yield classify(classifier)

    classifiedDocs.map(Json.toJson(_)).map(Ok(_))
  }

  private def invokeHostelReviewsService(params: RecordIdParams) =
    hostelsRetrievalService.retrieveHostelReviews(params.recordId).map(Json.toJson(_)).map(Ok(_))

}