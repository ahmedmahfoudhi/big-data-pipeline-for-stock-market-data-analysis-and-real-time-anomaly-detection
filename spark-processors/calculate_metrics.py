from pyspark.sql import SparkSession, functions as F
from pyspark.sql.types import IntegerType
# Initialize Spark Session
spark = SparkSession.builder \
    .appName("Stock Market Metrics Calculation") \
    .config("spark.jars.packages", "com.datastax.spark:spark-cassandra-connector_2.12:3.1.0,org.mongodb.spark:mongo-spark-connector_2.12:3.0.1") \
    .config("spark.mongodb.output.uri", "mongodb://mongo:27017/stock_market.stock_analysis?replicaSet=myReplicaSet") \
    .config("spark.cassandra.connection.host", "cassandra") \
    .config("spark.cassandra.connection.port", "9042") \
    .config("spark.master", "spark://spark-master:7077") \
    .getOrCreate()

# Read data from Cassandra
cassandra_df = spark.read \
    .format("org.apache.spark.sql.cassandra") \
    .options(table="stock_table", keyspace="stock_market") \
    .load()
# function to write data to mongodb


def write_to_mongo(data_df, id):

    data_df_with_additional_columns = data_df.withColumn(
        "id", F.lit(id)).withColumn("created_at", F.current_timestamp())
    data_df_with_additional_columns.write.format("mongo").mode("append").save()


nb_of_entries = cassandra_df.count()
nb_of_entries_df = spark.createDataFrame(
    [(nb_of_entries,)], ["value"]).withColumn("value", F.lit(nb_of_entries))
write_to_mongo(nb_of_entries_df, "nb_of_entries")
average_volume_df = cassandra_df.agg(F.mean("volume").alias("value"))
write_to_mongo(average_volume_df, "average_volume")
max_high_df = cassandra_df.agg(F.max("high").alias("value"))
write_to_mongo(max_high_df, "highest_high")
min_low_df = cassandra_df.agg(F.min("low").alias("value"))
write_to_mongo(min_low_df, "lowest_low")
spark.stop()
