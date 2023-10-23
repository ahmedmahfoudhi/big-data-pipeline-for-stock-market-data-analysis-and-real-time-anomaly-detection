from pyspark.sql import SparkSession
from pyspark.ml import Pipeline
from pyspark.ml.clustering import KMeans
from pyspark.ml.feature import VectorAssembler

# Initialize Spark Session
spark = SparkSession.builder \
    .appName("Train Anomaly Detection Model") \
    .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.1.2,com.datastax.spark:spark-cassandra-connector_2.12:3.1.0") \
    .getOrCreate()

# Read data from Cassandra
cassandra_df = spark.read \
    .format("org.apache.spark.sql.cassandra") \
    .options(table="stock_table", keyspace="stock_market") \
    .load() \
    .drop("id") \
    .drop("day") \
    .drop("month") \
    .drop("year")

# Feature Engineering
feature_columns = ["high", "open", "close", "adj_close", "volume"]



# Assemble features into a vector
vector_assembler = VectorAssembler(inputCols=feature_columns, outputCol="features")

# Create a K-Means model
kmeans = KMeans(k=3, seed=1, featuresCol="features", predictionCol="cluster")

# Create a pipeline for data preprocessing and model training
pipeline = Pipeline(stages=[vector_assembler, kmeans])
model = pipeline.fit(cassandra_df)

# Save model to disk
try:
    model.write().overwrite().save("../models/k_means_model")
except Exception as e:
    print(f"Failed to save the model: {e}")

spark.stop()