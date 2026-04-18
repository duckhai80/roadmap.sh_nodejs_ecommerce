import amqp from "amqplib";

export const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");

    if (!connection) throw new Error("Connection to RabbitMQ failed");

    const channel = await connection.createChannel();

    return { channel, connection };
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);

    throw error;
  }
};

export const connectToRabbitMQForTest = async () => {
  try {
    const { channel, connection } = await connectToRabbitMQ();

    const message = "Hello from RabbitMQ";
    const queue = "test-queue";

    await channel.assertQueue(queue);
    await channel.sendToQueue(queue, Buffer.from(message));
    await connection.close();
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);

    throw error;
  }
};
