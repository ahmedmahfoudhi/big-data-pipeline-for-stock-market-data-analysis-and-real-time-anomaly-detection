from pyspark.sql import SparkSession, functions as F
# Initialize Spark Session
spark = SparkSession.builder \
    .appName("Volumes per month") \
    .config("spark.jars.packages", "com.datastax.spark:spark-cassandra-connector_2.12:3.1.0,org.mongodb.spark:mongo-spark-connector_2.12:3.0.1") \
    .config("spark.mongodb.output.uri", "mongodb://127.0.0.1:27017/stock_market.stock_analysis?replicaSet=myReplicaSet") \
    .getOrCreate()

# Read data from Cassandra
cassandra_df = spark.read \
    .format("org.apache.spark.sql.cassandra") \
    .options(table="stock_table", keyspace="stock_market") \
    .load()
volumes_per_month_df = cassandra_df.groupBy("month").agg(F.sum("volume").alias("total_volume"))
volumes_per_month_collected_df = volumes_per_month_df.agg(F.collect_list(F.struct("month", "total_volume")).alias("value"))
volumes_per_month_with_id = volumes_per_month_collected_df.withColumn("id", F.lit("volume_per_month")).withColumn("created_at", F.lit(F.current_timestamp()))
volumes_per_month_with_id.write.format("mongo").mode("append").save()
spark.stop()