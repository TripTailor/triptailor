name := """triptailor"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.8"

val slickV = "1.1.1"
val dbDependencies = Seq(
  "org.postgresql" % "postgresql" % "9.4.1208.jre7",
  "com.typesafe.play" %% "play-slick" % slickV
)

val scalatestplusV = "1.5.0-RC1"
val testDependencies = Seq(
  "org.scalatestplus.play" %% "scalatestplus-play" % scalatestplusV % Test
)

libraryDependencies ++= Seq(
  cache, ws
) ++ dbDependencies ++ testDependencies

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"
