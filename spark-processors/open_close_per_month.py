from pyspark.sql import SparkSession, functions as F
# Initialize Spark Session
spark = SparkSession.builder \
    .appName("Open Close calculation") \
    .config("spark.jars.packages", "com.datastax.spark:spark-cassandra-connector_2.12:3.1.0,org.mongodb.spark:mongo-spark-connector_2.12:3.0.1") \
    .config("spark.mongodb.output.uri", "mongodb://127.0.0.1:27017/stock_market.stock_analysis?replicaSet=myReplicaSet") \
    .getOrCreate()

# Read data from Cassandra
cassandra_df = spark.read \
    .format("org.apache.spark.sql.cassandra") \
    .options(table="stock_table", keyspace="stock_market") \
    .load()
open_close_per_month_df = cassandra_df.groupBy("month").agg(F.sum("open").alias("total_open"), F.sum("close").alias("total_close"))
open_close_per_month_collected_df = open_close_per_month_df.agg(F.collect_list(F.struct("month", "total_open", "total_close")).alias("value"))
open_close_per_month_with_id = open_close_per_month_collected_df.withColumn("id", F.lit("open_close_per_month")).withColumn("created_at", F.lit(F.current_timestamp()))
open_close_per_month_with_id.write.format("mongo").mode("append").save()
spark.stop()