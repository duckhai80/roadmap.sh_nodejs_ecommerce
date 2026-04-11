import { BadRequestError } from "@/core";
import { checkProductsByServer, findOneCartById } from "@/models";
import { Product } from "@/models/product/product.model";
import { ShopCheckoutReview } from "@/types";
import DiscountService from "./discount.service";

class CheckoutService {
  static async checkoutReview({
    userId,
    cartId,
    shopCheckouts,
  }: {
    userId: string;
    cartId: string;
    shopCheckouts: ShopCheckoutReview[];
  }) {
    const foundCart = await findOneCartById(cartId);

    if (!foundCart) throw new BadRequestError("Cart not found");

    const resolvedShopCheckouts = [];
    const checkoutSummary = {
      totalOrder: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalPayment: 0,
    };

    // Loop for each shop
    for (const shopCheckout of shopCheckouts) {
      const {
        shopId,
        discount: shopDiscounts = [],
        products: shopProducts = [],
      } = shopCheckout;

      // Check product is available
      const checkedShopProducts = await checkProductsByServer(shopProducts);

      if (checkedShopProducts.length === 0)
        throw new BadRequestError("Product not found");

      // Calculate shop order value
      const shopOrderValue = checkedShopProducts.reduce((acc, shopProduct) => {
        return acc + shopProduct?.price! * shopProduct?.quantity!;
      }, 0);

      // Total order value before process
      checkoutSummary.totalOrder += shopOrderValue;

      const shopCheckoutSummary = {
        shopId,
        discount: shopDiscounts,
        price: shopOrderValue,
        priceAppliesDiscount: shopOrderValue,
        products: shopProducts,
      };

      // Calculate discount
      if (shopDiscounts.length > 0) {
        const { discountAmount } =
          await DiscountService.calculateDiscountAmount({
            shopId,
            userId,
            code: shopDiscounts[0]?.code!,
            products: checkedShopProducts! as Partial<Product>[],
          });

        // Add discount amount per discount code
        checkoutSummary.totalDiscount += discountAmount;

        if (discountAmount) {
          shopCheckoutSummary.priceAppliesDiscount =
            shopOrderValue - discountAmount;
        }
      }

      checkoutSummary.totalPayment += shopCheckoutSummary.priceAppliesDiscount;
      resolvedShopCheckouts.push(shopCheckoutSummary);
    }

    return {
      shopCheckouts,
      resolvedShopCheckouts,
      checkoutSummary,
    };
  }
}

export default CheckoutService;
