export interface CartOrder {
  products: CartProduct[];
  version: number;
}

export interface CartProduct {
  shopId: string;
  productId: string;
  price?: number;
  quantity: number;
  oldQuantity?: number;
}

export enum CartStatus {
  ACTIVE = "active",
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}
