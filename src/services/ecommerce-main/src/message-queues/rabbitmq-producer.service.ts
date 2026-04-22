import { connectToRabbitMQ } from "./init.rabbitmq";

class RabbitMQProducerService {
  static async produceQueue() {
    try {
      const { connection, channel } = await connectToRabbitMQ();
      const exchangeName = "notificationExchange";
      const exchangeDLXName = "notificationExchangeDLX";
      const routingKeyDLX = "notification.dlx";
      const queueName = "notificationQueue";

      await channel.assertExchange(exchangeName, "direct", { durable: true });

      const queueResults = await channel.assertQueue(queueName, {
        exclusive: false,
        deadLetterExchange: exchangeDLXName,
        deadLetterRoutingKey: routingKeyDLX,
      });

      await channel.bindQueue(queueResults.queue, exchangeName, "");

      const message = "A new product has been created";

      await channel.sendToQueue(queueResults.queue, Buffer.from(message), {
        expiration: "10000",
      });

      console.log("Message sent to queue");

      setTimeout(() => {
        connection.close();
        process.exit(0);
      }, 2000);
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}

export default RabbitMQProducerService;
