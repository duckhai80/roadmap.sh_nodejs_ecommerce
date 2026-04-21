import amqp from "amqplib";
import {
  connectToRabbitMQ,
  consumeExchange,
  consumeQueue,
  publishExchange,
} from "../dbs/init.rabbitmq";

class ConsumerService {
  static async consumeQueue(queueName: string) {
    try {
      const { channel, connection } = await connectToRabbitMQ();

      await consumeQueue(channel, queueName);
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

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

  static async consumeExchange({
    exchangeName,
    exchangeType,
    routingKey,
    callback,
  }: {
    exchangeName: string;
    exchangeType: string;
    routingKey: string;
    callback: (msg: amqp.Message | null) => void;
  }) {
    try {
      const { channel } = await connectToRabbitMQ();

      await consumeExchange({
        channel,
        exchangeName,
        exchangeType,
        routingKey,
        callback,
      });
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}

export default ConsumerService;
