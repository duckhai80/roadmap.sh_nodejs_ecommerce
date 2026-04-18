import { connectToRabbitMQForTest } from "../dbs/init.rabbitmq";

describe("RabbitMQ connection", () => {
  it("should connect successfully", async () => {
    const result = await connectToRabbitMQForTest();

    expect(result).toBeUndefined();
  });
});
