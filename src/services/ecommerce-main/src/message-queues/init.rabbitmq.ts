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
