import {
  connectToRabbitMQ,
  consumeExchange,
  consumeQueue,
  produceExchange,
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

  static async publishExchange(exchangeName: string) {
    try {
      const { channel, connection } = await connectToRabbitMQ();

      await produceExchange(channel, exchangeName);

      setTimeout(() => {
        connection.close();
        process.exit(0);
      }, 2000);
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  static async consumeExchange(exchangeName: string) {
    try {
      const { channel, connection } = await connectToRabbitMQ();

      await consumeExchange(channel, exchangeName);
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}

export default ConsumerService;
