export interface Product {
  id: string;
  name: string;
  collection: string;
  price: number;
  image: string;
  description: string;
  features: string[];
}

export interface CartItem extends Product {
  quantity: number;
}
