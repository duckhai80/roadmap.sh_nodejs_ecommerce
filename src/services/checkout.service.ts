import { BadRequestError } from "@/core";
import { checkProductsByServer, findOneCartById } from "@/models";
import { Product } from "@/models/product/product.model";
import { ShopOrderCheckout } from "@/types";
import DiscountService from "./discount.service";

class CheckoutService {
  static async checkoutReview({
    userId,
    cartId,
    shopOrderCheckouts,
  }: {
    userId: string;
    cartId: string;
    shopOrderCheckouts: ShopOrderCheckout[];
  }) {
    const foundCart = await findOneCartById(cartId);

    if (!foundCart) throw new BadRequestError("Cart not found");

    const newShopOrderCheckouts = [];
    const priceCheckout = {
      totalOrderValue: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };

    // Loop for each shop
    for (let index = 0; index < shopOrderCheckouts.length; index++) {
      const {
        shopId,
        discount: shopDiscounts = [],
        products: shopProducts = [],
      } = shopOrderCheckouts[index]!;

      // Check product is available
      const checkShopProducts = await checkProductsByServer(shopProducts);

      if (checkShopProducts.length === 0)
        throw new BadRequestError("Product not found");

      // Calculate shop order value
      const shopOrderValue = checkShopProducts.reduce((acc, shopProduct) => {
        return acc + shopProduct?.price! * shopProduct?.quantity!;
      }, 0);

      // Total order value before process
      priceCheckout.totalOrderValue += shopOrderValue;

      const shopOrderCheckout = {
        shopId,
        discount: shopDiscounts,
        price: shopOrderValue,
        priceAppliesDiscount: shopOrderValue,
        products: shopProducts,
      };

      // Calculate discount
      if (shopDiscounts.length > 0) {
        const { totalOrderValue, discountAmount } =
          await DiscountService.calculateDiscountAmount({
            shopId,
            userId,
            code: shopDiscounts[0]?.code!,
            products: checkShopProducts! as Partial<Product>[],
          });

        // Add discount amount per discount code
        priceCheckout.totalDiscount += discountAmount;

        if (discountAmount) {
          shopOrderCheckout.priceAppliesDiscount =
            shopOrderValue - discountAmount;
        }
      }

      priceCheckout.totalCheckout += shopOrderCheckout.priceAppliesDiscount;
      newShopOrderCheckouts.push(shopOrderCheckout);
    }

    return {
      shopOrderCheckouts,
      newShopOrderCheckouts,
      priceCheckout,
    };
  }
}

export default CheckoutService;
