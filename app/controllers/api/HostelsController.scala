package controllers.api

import javax.inject.{Inject, Singleton}

import models.db.services.{HostelsRetrievalService, HostelsRetrievalServiceImpl}
import play.api.{Configuration, Environment}
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.json.Json
import play.api.mvc.Action
import services.{ClassificationService, StopWordsFilterService, StopWordsFilterServiceImpl}

import scala.concurrent.ExecutionContext

@Singleton
class HostelsController @Inject()(dbConfig: DatabaseConfigProvider,
                                  env: Environment,
                                  conf: Configuration,
                                  stopWordsService: StopWordsFilterService)
                                 (implicit ec: ExecutionContext) extends BaseApiController {

  private val service: HostelsRetrievalService = new HostelsRetrievalServiceImpl(dbConfig)

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
        ratedDocs  ← service.retrieveHostelsModel(params.locationId)
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
        ratedDocs  ← service.retrieveHostelsModel(params.recordId)
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
    service.retrieveHostelReviews(params.recordId).map(Json.toJson(_)).map(Ok(_))

}