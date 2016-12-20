name := """triptailor"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.8"

val playSlickV = "2.0.0"
val pgV = "9.4-1201-jdbc41"
val slickV = "3.1.1"
val slickPGV = "0.14.3"
val dbDependencies = Seq(
  "org.postgresql" % "postgresql" % pgV,
  "com.typesafe.play" %% "play-slick" % playSlickV,
  "com.typesafe.slick" %% "slick-codegen" % slickV,
  "com.github.tminglei" %% "slick-pg" % slickPGV,
  "com.github.tminglei" %% "slick-pg_play-json" % slickPGV
)

val scalatestplusV = "1.5.0"
val testDependencies = Seq(
  "org.scalatestplus.play" %% "scalatestplus-play" % scalatestplusV % Test
)

libraryDependencies ++= Seq(
  cache, ws
) ++ dbDependencies ++ testDependencies

val consoleCmds =
  """
    | import scala.concurrent.duration.DurationInt
    | import scala.concurrent.{ Await, Future }
    | import play.api.libs.json._
    | import play.api.{ Environment, ApplicationLoader, Play, Mode }
    | import slick.driver.JdbcProfile
    | import play.api.db.slick._
    | import models.db.schema._
    | val env = Environment(new java.io.File("."), this.getClass.getClassLoader, Mode.Dev)
    | val context = ApplicationLoader.createContext(env)
    | val loader = ApplicationLoader(context)
    | val app = loader.load(context)
    | Play.start(app)
    | import Play.current
    | implicit val ec = scala.concurrent.ExecutionContext.global
    | import Tables._
    | val dbConfig = DatabaseConfigProvider.get[JdbcProfile](app)
    | import dbConfig.driver.api._
    | val db = dbConfig.db
  """.stripMargin

initialCommands in console := consoleCmds

triggeredMessage in ThisBuild := Watched.clearWhenTriggered

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"
