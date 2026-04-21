import amqp from "amqplib";

const mockMessage = process.argv[2] || "Hello World";
// const mockMessage = process.argv.slice(2).join(" ") || "Hello world";

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

export const consumeQueue = async (
  channel: amqp.Channel,
  queueName: string,
) => {
  try {
    await channel.assertQueue(queueName, { durable: true });

    channel.consume(
      queueName,
      (msg) => {
        console.log(`Received message: ${msg?.content.toString()}`);
      },
      { noAck: true },
    );
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const produceExchange = async (
  channel: amqp.Channel,
  exchangeName: string,
  message: string = mockMessage,
) => {
  try {
    await channel.assertExchange(exchangeName, "fanout", { durable: true });
    await channel.publish(exchangeName, "", Buffer.from(message));
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const consumeExchange = async (channel: amqp.Channel, exchangeName) => {
  try {
    await channel.assertExchange(exchangeName, "fanout", { durable: true });

    const { queue } = await channel.assertQueue("", { exclusive: true });

    console.log("🚀 ~ consumeExchange ~ queue:", queue);

    await channel.bindQueue(queue, exchangeName, "");
    await channel.consume(
      queue,
      (msg) => {
        console.log(`Message: `, msg?.content.toString());
      },
      {
        noAck: true,
      },
    );
  } catch (error) {
    console.error(error);

    throw error;
  }
};
