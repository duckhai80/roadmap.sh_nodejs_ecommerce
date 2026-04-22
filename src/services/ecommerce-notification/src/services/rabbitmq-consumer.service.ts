import {
  connectToRabbitMQ,
  consumeExchange,
  consumeQueue,
} from "@/message-queues/init.rabbitmq";
import amqp from "amqplib";

class ConsumerService {
  static async consumeQueue(queueName: string) {
    try {
      const { channel } = await connectToRabbitMQ();

      await consumeQueue(channel, queueName);
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

  static async consumeExchangeNormal() {
    try {
      const { channel } = await connectToRabbitMQ();
      const queueName = "notificationQueue";

      /* // Handle timeout error
      setTimeout(() => {
        channel.consume(
          queueName,
          (msg) => {
            console.log(msg?.content.toString());
          },
          { noAck: true },
        );
      }, 15000); */

      // Handle logic error
      channel.consume(queueName, (msg) => {
        try {
          const numberRandom = Math.random();

          if (numberRandom < 0.8)
            throw new Error("Message failed to process, please hot fix it");

          console.log("Message received:", msg?.content.toString());
        } catch (error) {
          channel.nack(msg, false, false);
        }
      });
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  static async consumeExchangeFailed() {
    try {
      const { channel } = await connectToRabbitMQ();
      const exchangeDLXName = "notificationExchangeDLX";
      const routingKeyDLX = "notification.dlx";
      const queueName = "notificationQueueHotFix";

      await channel.assertExchange(exchangeDLXName, "direct", {
        durable: true,
      });

      await channel.assertQueue(queueName, {
        exclusive: false,
      });

      await channel.bindQueue(queueName, exchangeDLXName, routingKeyDLX);

      await channel.consume(
        queueName,
        (msgFailed) => {
          console.log(
            "Message failed to process, please hot fix it:",
            msgFailed?.content.toString(),
          );
        },
        { noAck: true },
      );
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}

export default ConsumerService;
