from kafka import KafkaProducer
from json import dumps
import pandas as pd
import sys
from time import sleep

if len(sys.argv) < 3:
    print("Usage: python KafkaProducer.py <topic_name> <data_location> [sleep_time]")
    sys.exit(1)

topic_name = sys.argv[1]
data_location = sys.argv[2]
sleep_time = int(sys.argv[3]) if len(sys.argv) > 3 else 0

producer = KafkaProducer(
    bootstrap_servers='172.20.0.5:9092',
    value_serializer=lambda x: dumps(x).encode('utf-8')
)

df = pd.read_csv(data_location)

for index, row in df.iterrows():
    stock_row = row.to_dict()
    producer.send(topic_name, value=stock_row)
    sleep(sleep_time)

producer.flush()
