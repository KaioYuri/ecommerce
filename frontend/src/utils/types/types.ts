export interface Category {
  id: number;
  name: string;
};

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  quantity: number;
  isActive: boolean;
  category: Category;
};

export interface Purchase {
  id: number;
  price: string;
  quantity: number;
  purchaseDate: string;
  status: string;
  paymentDate: string | null;
  installments: number;
};

export interface SalePurchase {
  id: number;
  product: Product;
  quantity: number;
};

export interface Sale {
  id: number;
  customer: string;
  saleDate: string;
  products: SalePurchase[];
};

export interface SalePurchaseResponse {
  sales: Sale[];
  purchases: Purchase[];
}