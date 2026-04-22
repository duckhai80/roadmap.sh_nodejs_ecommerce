import { RabbitMQConsumerService } from "@/services";

const queueName = "test-topic";

// RabbitMQConsumerService.consumeQueue(queueName)
//   .then(() => {
//     console.log(`Message consumer ${queueName} started`);
//   })
//   .catch((error) => console.error(error));

const logConsole = console.log;

console.log = function () {
  logConsole.apply(console, [new Date()].concat(arguments as any));
};

RabbitMQConsumerService.consumeExchangeNormal()
  .then(() => {
    console.log("Message consumer normal started");
  })
  .catch((error) => console.error(error));

RabbitMQConsumerService.consumeExchangeFailed()
  .then(() => {
    console.log("Message consumer failed started");
  })
  .catch((error) => console.error(error));
