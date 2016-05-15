package controllers.api

import play.api.data.Form
import play.api.mvc.Controller

import scala.concurrent.Future

trait BaseApiController extends Controller {
  protected def incorrectServiceCall(f: Form[_]) = Future.successful(BadRequest)
}