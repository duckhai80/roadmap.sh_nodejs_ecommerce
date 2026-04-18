import { redisPubSubService } from "@/services";

class InventoryServiceTest {
  constructor() {
    redisPubSubService.subscribe("purchase_events", (message, channel) => {
      InventoryServiceTest.update(message);
    });
  }

  static update(message: string) {
    console.log(
      `Update inventory for productId ${JSON.parse(message).productId} with quantity ${JSON.parse(message).quantity}`,
    );
  }
}

export default new InventoryServiceTest();
