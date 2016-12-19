package modules

import com.google.inject.AbstractModule
import models.db.services.{ReviewService, ReviewServiceImpl}

class ReviewServiceModule extends AbstractModule {

  def configure(): Unit = {
    bind(classOf[ReviewService])
      .to(classOf[ReviewServiceImpl])
      .asEagerSingleton()
  }

}