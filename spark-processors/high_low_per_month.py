from pyspark.sql import SparkSession, functions as F
# Initialize Spark Session
spark = SparkSession.builder \
    .appName("High Low Calculation") \
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
high_low_per_month_df = cassandra_df.groupBy("month").agg(
    F.sum("high").alias("total_high"), F.sum("low").alias("total_low"))
high_low_per_month_collected_df = high_low_per_month_df.agg(
    F.collect_list(F.struct("month", "total_high", "total_low")).alias("value"))
high_low_per_month_with_id = high_low_per_month_collected_df.withColumn("id", F.lit(
    "high_low_per_month")).withColumn("created_at", F.lit(F.current_timestamp()))
high_low_per_month_with_id.write.format("mongo").mode("append").save()
spark.stop()
