import ConsumerService from "../services/consumer.service";

const exchangeName = "video";

ConsumerService.consumeExchange(exchangeName)
  .then(() => {
    console.log(`Message consumer ${exchangeName} started`);
  })
  .catch((error) => console.error(error));
