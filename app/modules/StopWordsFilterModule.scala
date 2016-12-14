package modules

import com.google.inject.AbstractModule
import services.{StopWordsFilterService, StopWordsFilterServiceImpl}

class StopWordsFilterModule extends AbstractModule {

  def configure(): Unit = {
    bind(classOf[StopWordsFilterService])
      .to(classOf[StopWordsFilterServiceImpl])
      .asEagerSingleton()
  }

}