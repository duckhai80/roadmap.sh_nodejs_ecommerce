import { BadRequestError } from "@/core";
import { orderModel } from "@/models";
import { ShopCheckoutReview } from "@/types";
import CheckoutService from "./checkout.service";
import RedisService from "./redis.service";

class OrderService {
  static async createByUser({
    cartId,
    userId,
    userAddress,
    userPayment,
    shopCheckouts,
  }: {
    cartId: string;
    userId: string;
    userAddress: string;
    userPayment: string;
    shopCheckouts: ShopCheckoutReview[];
  }) {
    const redisClient = await RedisService.getClient();
    const { resolvedShopCheckouts, checkoutSummary } =
      await CheckoutService.checkoutReview({
        userId,
        cartId,
        shopCheckouts,
      });
    const products = resolvedShopCheckouts.flatMap(
      (shopCheckout) => shopCheckout.products,
    );
    const acquiredProducts = [];

    for (const product of products) {
      const keyLock = await RedisService.acquireLock({
        cartId,
        productId: product.productId,
        quantity: product.quantity,
        redisClient,
      });

      acquiredProducts.push(keyLock ? true : false);

      if (keyLock) {
        await RedisService.releaseLock({ keyLock, redisClient });
      }
    }

    if (acquiredProducts.includes(false)) {
      throw new BadRequestError("Some products are changed, please try again");
    }

    const newOrder = await orderModel.create({
      userId,
      checkout: checkoutSummary,
      shipping: userAddress,
      payment: userPayment,
      products: resolvedShopCheckouts,
      // trackingNumber: "#0000110042026",
      // status: OrderStatus.PENDING
    });

    return newOrder;
  }

  // Find all orders by user
  static async findAllByUser() {}

  // Find order by user
  static async findOneByUser() {}

  // Update order status by admin/shop
  static async updateStatusByShop() {}

  // Cancel by user
  static async cancelByUser() {}
}

export default OrderService;
