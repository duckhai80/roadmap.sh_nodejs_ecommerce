import amqp from "amqplib";

const runConsumer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    const channel = await connection.createChannel();
    const queueName = "test-topic";

    await channel.assertQueue(queueName);

    channel.consume(
      queueName,
      (msg) => {
        console.log("Received message: ", msg?.content.toString());
      },
      {
        noAck: true,
      },
    );
  } catch (error) {
    console.error(error);
  }
};

runConsumer();
