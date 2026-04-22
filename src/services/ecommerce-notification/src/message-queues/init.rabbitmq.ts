import amqp from "amqplib";

const mockMessage = process.argv.slice(2).join(" ") || "Hello world";

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

export const publishExchange = async ({
  channel,
  exchangeName,
  exchangeType,
  routingKey = "#",
  message,
}: {
  channel: amqp.Channel;
  exchangeName: string;
  exchangeType: string;
  routingKey: string;
  message: string;
}) => {
  try {
    await channel.assertExchange(exchangeName, exchangeType, { durable: true });
    await channel.publish(exchangeName, routingKey, Buffer.from(message), {
      persistent: true,
    });
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const consumeExchange = async ({
  channel,
  exchangeName,
  exchangeType,
  routingKey = "#",
  callback,
}: {
  channel: amqp.Channel;
  exchangeName: string;
  exchangeType: string;
  routingKey: string;
  callback: (msg: amqp.Message | null) => void;
}) => {
  try {
    await channel.assertExchange(exchangeName, exchangeType, { durable: true });

    const { queue } = await channel.assertQueue("", { exclusive: true });

    console.log(`Queue::: ${queue}, Routing key::: ${routingKey}`);

    await channel.bindQueue(queue, exchangeName, routingKey);
    channel.consume(queue, (msg) => callback(msg), { noAck: true });
  } catch (error) {
    console.error(error);

    throw error;
  }
};
