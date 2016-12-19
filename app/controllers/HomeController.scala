package controllers

import javax.inject._

import play.api.mvc._

@Singleton
class HomeController @Inject() extends Controller {

  def index = Action { implicit request =>
    Ok(views.html.index())
  }

  def tags = Action { implicit request =>
    Ok(views.html.tags())
  }

  def search = Action { implicit request =>
    Ok(views.html.results())
  }

  def aboutUs = Action { implicit request =>
    Ok(views.html.aboutUs())
  }

}