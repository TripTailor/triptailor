package services

import play.api.{Configuration, Environment}

import scala.io.Source

trait StopWordsFilterService {
  def stopWords: Set[String]
  def quotedStopWordsString: String = stopWords.mkString("'", "', '", "'")
}

class StopWordsFilterServiceImpl(env: Environment, conf: Configuration) extends StopWordsFilterService {
  private val fileName      = conf.getString("stopWords").get
  private val stopWordsFile = Source.fromInputStream(env.classLoader.getResourceAsStream(fileName))

  def stopWords = stopWordsFile.getLines.toSet
}