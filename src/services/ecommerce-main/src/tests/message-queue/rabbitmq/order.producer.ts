import { connectToRabbitMQ } from "@/message-queues/init.rabbitmq";

async function runProducerOrder() {
  const { connection, channel } = await connectToRabbitMQ();
  const queueName = "order-message";

  await channel.assertQueue(queueName, { durable: true });

  for (let index = 0; index < 10; index++) {
    const message = `ordered-message::${index}`;

    console.log("🚀 ~ runProducerOrder ~ message:", message);
    channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
  }

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 2000);
}

runProducerOrder();
