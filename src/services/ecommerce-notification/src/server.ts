import { ConsumerService } from "@/services";

const queueName = "test-topic";

ConsumerService.consumeQueue(queueName)
  .then(() => {
    console.log(`Message consumer ${queueName} started`);
  })
  .catch((error) => console.error(error));
