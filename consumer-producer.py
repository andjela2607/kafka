from kafka import KafkaConsumer
from kafka import KafkaProducer
import requests, json

consumer = KafkaConsumer('topic2', bootstrap_servers='localhost:9092', group_id='my-group')
producer = KafkaProducer(bootstrap_servers='localhost:9092')

total_temperature = 0
message_count = 0

# Read and process messages from the Kafka topic
for message in consumer:
    # Decode and load JSON data from the Kafka message
    weather_data = message.value.decode('utf-8')
    weather_data_json = json.loads(weather_data)

    total_temperature += weather_data_json['main']['temp']
    message_count += 1
    temperature_in_c = total_temperature - 273.15
    print(temperature_in_c)

    weather_data_json['temperature_in_c']=temperature_in_c

    producer.send('topic2', json.dumps(weather_data_json).encode('utf-8'))
    


# Close the consumer (this part will not be reached in this example)
consumer.close()
producer.close()