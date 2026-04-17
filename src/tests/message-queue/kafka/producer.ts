import { Kafka, Partitioners } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

const runProducer = async () => {
  try {
    console.log("Connecting to Kafka...");
    await producer.connect();
    console.log("Connected successfully!");

    await producer.send({
      topic: "test-topic",
      messages: [{ value: "Hello Kafka user!" }],
    });
    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Error in producer:", error);
  } finally {
    await producer.disconnect();
    console.log("Disconnected.");
  }
};

runProducer();
