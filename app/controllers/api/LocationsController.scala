package controllers.api

import javax.inject.{Inject, Singleton}

import models.db.services.{LocationHintsService, LocationHintsServiceImpl}
import play.api.data.Form
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class LocationsController @Inject()(dbConfig: DatabaseConfigProvider)(implicit ec: ExecutionContext) extends Controller {
  private val service: LocationHintsService = new LocationHintsServiceImpl(dbConfig)

  def retrieveLocationHints = Action.async { implicit request =>
    queryTextParams.bindFromRequest.fold(
      hasErrors = incorrectServiceCall,
      success   = callLocationService
    )
  }

  private def incorrectServiceCall(f: Form[_]) = Future.successful(BadRequest)
  private def callLocationService(query: QueryTextParams) =
    service.retrieveLocationHints(query.q).map(Json.toJson(_)).map(Ok(_))
}