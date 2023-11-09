from pyspark.sql import SparkSession, functions as F
from pyspark.ml import PipelineModel
from pyspark.ml.clustering import KMeansModel
from pyspark.ml.feature import VectorAssembler
from pyspark.sql.types import FloatType
from pyspark.sql.functions import col
from pyspark.sql.types import StructType, StructField, DoubleType, StringType
import numpy as np
import os

kafka_server = "kafka:9092"

# Initialize Spark Session
spark = SparkSession.builder \
    .appName("Real Time Prediction") \
    .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.1.2,org.mongodb.spark:mongo-spark-connector_2.12:3.0.1") \
    .config("spark.mongodb.output.uri", "mongodb://mongo:27017/stock_market.stock_predictions?replicaSet=myReplicaSet") \
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


# Read from Kafka
streaming_df = spark \
    .readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", kafka_server) \
    .option("subscribe", "real_time_stock_market_data") \
    .load()
value_df = streaming_df.selectExpr("CAST(value AS STRING) as json") \
    .select(F.from_json("json", schema=schema).alias("data")) \
    .select("data.*")
stock_data = value_df.select(
    F.col("Date").alias("date"),
    F.col("High").alias("high"),
    F.col("Open").alias("open"),
    F.col("low").alias("low"),
    F.col("Close").alias("close"),
    F.col("Adj Close").alias("adj_close"),
    F.col("Volume").alias("volume"),
)
stock_data_with_anomalies = stock_data

# features
feature_columns = ["high", "open", "close", "adj_close", "volume"]
# Assemble features
assembler = VectorAssembler(
    inputCols=feature_columns, outputCol="features", handleInvalid="keep")
assembled_data = assembler.transform(stock_data_with_anomalies)


# load pipeline
model_path = "hdfs://hdfs-namenode:8020/models/k_means_model"
pipeline_model = PipelineModel.load(model_path)
# get kmeans model
model = pipeline_model.stages[-1]

# predict
predictions = pipeline_model.transform(stock_data)
# get constructed centroids
centroids = model.clusterCenters()
# threshold to be used for comparison
threshold = 50000


@F.udf(returnType=FloatType())
def calc_distance_to_centroid(features, prediction):
    center = centroids[prediction]
    return float(np.linalg.norm(features - center))


def process_batch(batch_df, batch_id):
    if batch_df.count() > 0:
        df_with_distance = batch_df.withColumn(
            'distance_to_centroid', calc_distance_to_centroid(col('features'), col('cluster')))
        df_with_prediction = df_with_distance.withColumn('is_anomaly', df_with_distance["distance_to_centroid"] > threshold).drop("features")\
            .drop("cluster") \
            .drop("distance_to_centroid").withColumn("created_at", F.lit(F.current_timestamp()))
        df_with_prediction.write.format("mongo").mode("append").save()


query = predictions.writeStream.foreachBatch(process_batch).start()
query.awaitTermination()

# spark-submit --packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.1.2,org.mongodb.spark:mongo-spark-connector_2.12:3.0.1 --master spark://spark-master:7077
