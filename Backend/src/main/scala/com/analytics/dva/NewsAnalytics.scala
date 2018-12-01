package com.analytics.dva

import org.apache.hadoop.conf.Configuration
import org.apache.hadoop.fs.{FileSystem, FileUtil, Path}
import org.apache.log4j.Level
import org.apache.log4j.Logger
import org.apache.spark
import org.apache.spark.sql.{SaveMode, SparkSession}
import org.apache.spark.sql.functions.desc
import org.apache.spark.ml.feature.{HashingTF, IDF, Tokenizer}
import org.apache.spark.sql.functions.desc
import org.apache.spark.sql.functions._
import org.apache.spark.ml.feature.StopWordsRemover
import org.apache.spark.sql.functions._

case class doc(id: String, date: String, headline:String, snippet: String, web_url: String, image_url: String, keywords: String)

object NewsAnalytics{
  def main(args: Array[String]): Unit = {

    Logger.getLogger("org").setLevel(Level.ERROR)
    val spark = SparkSession.builder()
      .master("local[10]")
      .appName("SparkTest")
      .config("spark.files.overwrite", "true")
      .getOrCreate()



    val path = "D:\\Gatech\\DVA\\News\\Data\\Input"
    val conf = new Configuration()
    val fs = FileSystem.get(conf)
    val p = new Path(path)
    val ls = fs.listStatus(p)
    ls.foreach(x=>{process_file(x.getPath.toString(),spark) })
  }


def process_file(filepath: String,spark:SparkSession): Unit = {
    import spark.implicits._

//    val df = spark.read.textFile("D:\\Gatech\\DVA\\News\\Data\\Input\\2016_1.tsv")
    val filename = filepath.split("/").last
    val foldername = filename.split("\\.")(0)
    println("Started processing file : "+filepath)

//    spark.read.textFile(filename)
//    .map(_.split("\t",-1))
//    .filter(_.size < 3)
//    .foreach(x=>println(x(0)))
    val df = spark.read
      .option("encoding", "UTF-8")
      .textFile(filepath)
      .map(_.split("\t",-1))
      .filter(_.size==7)
      .map(columns => doc(columns(0), columns(1),columns(2), columns(3),columns(4), columns(5),columns(6))).toDF()

    val unique_vals = df.dropDuplicates("headline")

    val calcIdfUdf = udf((data: Long, docCount: Long) => {math.log((docCount.toDouble + 1) / (data.toDouble + 1)) })

    val mult = udf((one: Long, two: Long) => { one * two})


    val tokenizer = new Tokenizer().setInputCol("keywords").setOutputCol("words")
    val wordsData = tokenizer.transform(unique_vals)

    // Map list items to rows
    val columns = wordsData.columns.map(col) :+
      (explode(col("words")) as "token")
    val unfoldedDocs = wordsData.select(columns: _*)


    val tf_data = unfoldedDocs.groupBy("id", "token")
      .agg(count("id") as "tf")

    val df_data = tf_data.groupBy("token")
      .agg(countDistinct("id") as "df")

    val docCount = wordsData.count()
    val df_data_with_count = df_data.withColumn("cnt", lit(docCount))

    val tokensWithDfIdf = df_data_with_count.withColumn("idf", calcIdfUdf(column("df"),column("cnt")))

    val final_data = tf_data.join(tokensWithDfIdf, Seq("token"), "left").withColumn("tf_idf", mult(column("tf"),column("idf")))

    val result_summary = final_data.filter($"tf_idf" > 10 || $"token".contains("~"))
      //         .filter($"token".contains("~"))
      .groupBy($"token")
      .agg(countDistinct($"id") as "word_count")
      .orderBy($"word_count".desc)

    val result = unique_vals.join(final_data,Seq("id"),"left")

    result
//    .select($"id",$"token",$"date",$"headline",$"snippet",$"web_url",$"image_url")
      .orderBy(asc("id"))
//      .coalesce(1)
      .write
//      .format("com.databricks.spark.csv")
      .option("encoding", "UTF-8")
      .option("delimiter", "\t")
      .option("header", "false")
      .mode(SaveMode.Append)
      .csv("D:\\Gatech\\DVA\\News\\Data\\output\\"+foldername)
    println("Finished processing file : "+filename)

//    result_summary
//      .orderBy($"word_count".desc)
////      .coalesce(1)
//      .write
//      .format("com.databricks.spark.csv")
//      .option("header", "true")
//      .option("delimiter", "\t")
//      .mode(SaveMode.Append)
//      .save("D:\\Gatech\\DVA\\News\\Data\\output\\result_output.tsv")


  }
}
