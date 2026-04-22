import {
  connectToRabbitMQ,
  publishExchange,
} from "@/message-queues/init.rabbitmq";

class ProducerService {
  static async publishExchange({
    exchangeName,
    exchangeType,
    routingKey,
    message,
  }: {
    exchangeName: string;
    exchangeType: string;
    routingKey: string;
    message: string;
  }) {
    try {
      const { connection, channel } = await connectToRabbitMQ();

      await publishExchange({
        channel,
        exchangeName,
        exchangeType,
        routingKey,
        message,
      });

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

export default ProducerService;
