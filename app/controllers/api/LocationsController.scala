package controllers.api

import javax.inject.{Inject, Singleton}

import models.db.services.{LocationHintsService, LocationHintsServiceImpl}
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.json.Json
import play.api.mvc.Action

import scala.concurrent.ExecutionContext

@Singleton
// TODO: Inject LocationHintsServiceImpl
class LocationsController @Inject()(dbConfig: DatabaseConfigProvider)(implicit ec: ExecutionContext)
    extends BaseApiController {
  private val service: LocationHintsService = new LocationHintsServiceImpl(dbConfig)

  def retrieveLocationHints = Action.async { implicit request =>
    queryTextParams.bindFromRequest.fold(
      hasErrors = incorrectServiceCall,
      success   = invokeService
    )
  }

  private def invokeService(query: QueryTextParams) =
    service.retrieveLocationHints(query.q).map(Json.toJson(_)).map(Ok(_))
}