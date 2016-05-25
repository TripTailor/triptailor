package controllers.api

import javax.inject.{Inject, Singleton}

import models.db.services.{HostelsRetrievalService, HostelsRetrievalServiceImpl}
import play.api.Configuration
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.json.Json
import play.api.mvc.Action
import services.ClassificationService

import scala.concurrent.ExecutionContext

@Singleton
class HostelsController @Inject()(dbConfig: DatabaseConfigProvider, conf: Configuration)(implicit ec: ExecutionContext)
    extends BaseApiController {

  private val service: HostelsRetrievalService = new HostelsRetrievalServiceImpl(dbConfig)

  def classify = Action.async { implicit request =>
    classificationParams.bindFromRequest.fold(
      hasErrors = incorrectServiceCall,
      success   = invokeService
    )
  }

  private def invokeService(params: ClassificationParams) = {
    val classifiedDocs =
      for {
        ratedDocs  ← service.retrieveHostelsModel(params.locationId)
        classifier = new ClassificationService(ratedDocs, conf.getDouble("classification.b").get, params.tags)
      } yield classifier.classify

    classifiedDocs.map(Json.toJson(_)).map(Ok(_))
  }

}