import { connectToRabbitMQ } from "@/message-queues/init.rabbitmq";

async function runConsumerOrder() {
  const { channel } = await connectToRabbitMQ();
  const queueName = "order-message";

  await channel.assertQueue(queueName, { durable: true });

  channel.prefetch(1);
  channel.consume(queueName, (msg) => {
    const message = msg?.content.toString();

    setTimeout(() => {
      console.log("Consumer processed: ", message);
      channel.ack(msg!);
    }, Math.random() * 1000);
  });
}

runConsumerOrder();
