export interface ShopOrderCheckout {
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
