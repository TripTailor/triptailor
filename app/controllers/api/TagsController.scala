package controllers.api

import javax.inject.{Inject, Singleton}

import models.db.services.{TagsService, TagsServiceImpl}
import play.api.{Configuration, Environment}
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.json.Json
import play.api.mvc.Action
import services.{StopWordsFilterService, StopWordsFilterServiceImpl}

import scala.concurrent.ExecutionContext

@Singleton
class TagsController @Inject()(dbConfig: DatabaseConfigProvider,
                               env: Environment,
                               conf: Configuration,
                               stopWordsService: StopWordsFilterService)
                              (implicit ec: ExecutionContext) extends BaseApiController{

  private val service: TagsService = new TagsServiceImpl(dbConfig, stopWordsService)

  def mostFrequentTags = Action.async { implicit request =>
    recordIdParams.bindFromRequest.fold(
      hasErrors = incorrectServiceCall,
      success   = invokeService
    )
  }

  private def invokeService(params: RecordIdParams) =
    service.retrieveMostCommonTags(params.recordId).map(Json.toJson(_)).map(Ok(_))
}