import { connectToRabbitMQ, consumeQueue } from "../dbs/init.rabbitmq";

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
}

export default ConsumerService;
