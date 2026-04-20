import amqp from "amqplib";

const message = "Hello, RabbitMQ from Khai Truong";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queueName = "test-topic";

    await channel.assertQueue(queueName, {
      durable: true,
    });

    // Send message to consumer channel
    channel.sendToQueue(queueName, Buffer.from(message));
  } catch (error) {
    console.error(error);
  }
};

runProducer();
