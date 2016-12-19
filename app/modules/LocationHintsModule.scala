package modules

import com.google.inject.AbstractModule
import models.db.services.{LocationHintsService, LocationHintsServiceImpl}

class LocationHintsModule extends AbstractModule {

  def configure(): Unit = {
    bind(classOf[LocationHintsService])
      .to(classOf[LocationHintsServiceImpl])
  }

}