import { redisPubSubService } from "@/services";

class ProductServiceTest {
  purchaseProduct(productId: string, quantity: number) {
    const orderTest = { productId, quantity };

    redisPubSubService.publish("purchase_events", JSON.stringify(orderTest));
  }
}

export default new ProductServiceTest();
