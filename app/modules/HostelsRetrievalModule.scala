package modules

import com.google.inject.AbstractModule
import models.db.services.{HostelsRetrievalService, HostelsRetrievalServiceImpl}

class HostelsRetrievalModule extends AbstractModule {

  def configure(): Unit = {
    bind(classOf[HostelsRetrievalService])
      .to(classOf[HostelsRetrievalServiceImpl])
      .asEagerSingleton()
  }

}