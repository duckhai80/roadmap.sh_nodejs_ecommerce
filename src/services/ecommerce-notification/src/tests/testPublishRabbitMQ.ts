import ConsumerService from "../services/rabbitmq-consumer.service";

const exchangeName = "mail";
const exchangeType = "topic";
const routingKey = "khai.tester";
const message = "Testing exchange topic type";

// ConsumerService.publishExchange(exchangeName)
//   .then(() => {
//     console.log(`Message producer ${exchangeName} started`);
//   })
//   .catch((error) => console.error(error));

ConsumerService.publishExchange({
  exchangeName,
  exchangeType,
  routingKey,
  message,
})
  .then(() => {
    console.log(`Message producer ${exchangeName} started`);
  })
  .catch((error) => console.error(error));
