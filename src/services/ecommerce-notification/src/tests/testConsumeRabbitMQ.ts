import amqp from "amqplib";
import ConsumerService from "../services/rabbitmq-consumer.service";

const exchangeName = "mail";
const exchangeType = "topic";
// const routingKey = "dev.tester.leader";
const routingKey = "*.tester";

// ConsumerService.consumeExchange(exchangeName)
//   .then(() => {
//     console.log(`Message consumer ${exchangeName} started`);
//   })
//   .catch((error) => console.error(error));

const responseMessage = (message: amqp.Message | null) => {
  console.log(message);
};

ConsumerService.consumeExchange({
  exchangeName,
  exchangeType,
  routingKey,
  callback: responseMessage,
})
  .then()
  .catch((error) => console.error(error));
