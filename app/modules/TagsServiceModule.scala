package modules

import com.google.inject.AbstractModule
import models.db.services.{TagsService, TagsServiceImpl}

class TagsServiceModule extends AbstractModule {

  def configure(): Unit = {
    bind(classOf[TagsService])
      .to(classOf[TagsServiceImpl])
      .asEagerSingleton()
  }

}