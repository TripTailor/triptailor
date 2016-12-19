package controllers.api

import javax.inject.{Inject, Singleton}

import models.db.services.TagsService
import play.api.libs.json.Json
import play.api.mvc.Action
import services.StopWordsFilterService

import scala.concurrent.ExecutionContext

@Singleton
class TagsController @Inject()(stopWordsService: StopWordsFilterService,
                               tagsService: TagsService)
                              (implicit ec: ExecutionContext) extends BaseApiController {

  def mostFrequentTags = Action.async { implicit request =>
    recordIdParams.bindFromRequest.fold(
      hasErrors = incorrectServiceCall,
      success   = invokeService
    )
  }

  private def invokeService(params: RecordIdParams) =
    tagsService.retrieveMostCommonTags(params.recordId).map(Json.toJson(_)).map(Ok(_))
}