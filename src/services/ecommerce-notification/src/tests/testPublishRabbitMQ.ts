import ConsumerService from "../services/consumer.service";

const exchangeName = "video";

ConsumerService.publishExchange(exchangeName)
  .then(() => {
    console.log(`Message producer ${exchangeName} started`);
  })
  .catch((error) => console.error(error));
