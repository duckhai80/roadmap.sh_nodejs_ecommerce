import RabbitMQProducerService from "@/message-queues/rabbitmq-producer.service";
import amqp from "amqplib";

const message = "Hello, RabbitMQ from Khai Truong";

/* 
const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queueName = "test-topic";

    await channel.assertQueue(queueName, { durable: true });

    // Send message to consumer channel
    channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
  } catch (error) {
    console.error(error);
  }
};

runProducer(); 
*/

const logConsole = console.log;

console.log = function () {
  logConsole.apply(console, [new Date()].concat(arguments as any));
};

RabbitMQProducerService.produceQueue();
