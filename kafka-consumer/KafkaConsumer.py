from kafka import KafkaConsumer
from json import loads

consumer = KafkaConsumer(
    'stock_market_dataset',
    bootstrap_servers=['localhost:9092'],
    auto_offset_reset='earliest',
    #value_deserializer=lambda x: loads(x.decode('utf-8'))
)

for c in consumer:
    print(c.value.decode('utf-8'))


