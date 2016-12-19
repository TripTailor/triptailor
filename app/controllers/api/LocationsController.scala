package controllers.api

import javax.inject.{Inject, Singleton}

import models.db.services.LocationHintsService
import play.api.libs.json.Json
import play.api.mvc.Action

import scala.concurrent.ExecutionContext

@Singleton
class LocationsController @Inject()(locationHintsService: LocationHintsService)(implicit ec: ExecutionContext)
    extends BaseApiController {

  def retrieveLocationHints = Action.async { implicit request =>
    queryTextParams.bindFromRequest.fold(
      hasErrors = incorrectServiceCall,
      success   = invokeService
    )
  }

  private def invokeService(query: QueryTextParams) =
    locationHintsService.retrieveLocationHints(query.q).map(Json.toJson(_)).map(Ok(_))
}