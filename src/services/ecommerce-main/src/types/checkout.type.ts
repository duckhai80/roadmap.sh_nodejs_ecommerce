export interface ShopCheckoutReview {
  shopId: string;
  discount: {
    shopId: string;
    discountId: string;
    productId: string;
    code: string;
  }[];
  products: {
    productId: string;
    price: number;
    quantity: number;
  }[];
}
