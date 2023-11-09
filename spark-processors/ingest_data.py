from pyspark.sql import SparkSession, functions as F
from pyspark.sql.functions import mean, stddev, col, lit
from pyspark.sql.types import StructType, StructField, DoubleType, StringType, IntegerType
import uuid
import os


# Initialize Spark Session
spark = SparkSession.builder \
    .appName("Ingest Data To Cassandra") \
    .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.1.2,com.datastax.spark:spark-cassandra-connector_2.12:3.1.0") \
    .config("spark.cassandra.connection.host", "cassandra") \
    .config("spark.cassandra.connection.port", "9042") \
    .config("spark.master", "spark://spark-master:7077") \
    .getOrCreate()

schema = StructType([
    StructField("Date", StringType(), True),
    StructField("High", DoubleType(), True),
    StructField("Open", DoubleType(), True),
    StructField("Close", DoubleType(), True),
    StructField("Adj Close", DoubleType(), True),
    StructField("Volume", DoubleType(), True),
    StructField("Low", DoubleType(), True)
])


@F.udf(returnType=StringType())
def generate_uuid():
    return str(uuid.uuid4())


@F.udf(returnType=IntegerType())
def get_day(str):
    '''
        str: string has the following format yyyyy-mm-dd
    '''
    return int(str.split('-')[-1])


@F.udf(returnType=IntegerType())
def get_month(str):
    '''
        str: string has the following format yyyyy-mm-dd
    '''
    return int(str.split('-')[1])


@F.udf(returnType=IntegerType())
def get_year(str):
    '''
        str: string has the following format yyyyy-mm-dd
    '''
    return int(str.split('-')[0])


# Read from Kafka
streaming_df = spark \
    .readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "kafka:9092") \
    .option("subscribe", "stock_market_dataset") \
    .load()
value_df = streaming_df.selectExpr("CAST(value AS STRING) as json") \
    .select(F.from_json("json", schema=schema).alias("data")) \
    .select("data.*")
stock_data = value_df.select(
    F.col("Date").alias("date"),
    F.col("High").alias("high"),
    F.col("Open").alias("open"),
    F.col("Close").alias("close"),
    F.col("Adj Close").alias("adj_close"),
    F.col("Volume").alias("volume"),
    F.col("Low").alias("low")
).withColumn('id', generate_uuid()) \
    .withColumn('day', get_day(F.col('date'))) \
    .withColumn('month', get_month(F.col('date'))) \
    .withColumn('year', get_year(F.col('date'))) \
    .drop('date')


# add data to cassandra
def write_to_cassandra(batch_df, batch_id):
    batch_df.write \
        .format("org.apache.spark.sql.cassandra") \
        .mode("append") \
        .options(table="stock_table", keyspace="stock_market") \
        .save()


query = stock_data.writeStream \
    .foreachBatch(write_to_cassandra) \
    .start()

query.awaitTermination()
