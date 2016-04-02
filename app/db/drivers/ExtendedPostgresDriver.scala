package db.drivers

import com.github.tminglei.slickpg.{ExPostgresDriver, PgArraySupport}

trait ExtendedPostgresDriver extends ExPostgresDriver with PgArraySupport {

  override val api = ExtendedAPI

  object ExtendedAPI extends API with ArrayImplicits {
    implicit val strListTypeMapper = new SimpleArrayJdbcType[String]("text").to(_.toList)
  }
}

object ExtendedPostgresDriver extends ExtendedPostgresDriver