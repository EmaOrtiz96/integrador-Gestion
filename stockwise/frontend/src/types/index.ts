export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  price: number;
  stock: number;
  stock_min: number;
  unit: string;
  category_id?: number;
  category?: Category;
  created_at: string;
  updated_at?: string;
}

export type MovementType = 'entrada' | 'salida' | 'ajuste';

export interface Movement {
  id: number;
  product_id: number;
  type: MovementType;
  quantity: number;
  reason?: string;
  stock_before: number;
  stock_after: number;
  created_at: string;
  product?: Product;
}

export interface MovementCreate {
  product_id: number;
  type: MovementType;
  quantity: number;
  reason?: string;
}

export interface DashboardStats {
  total_products: number;
  total_stock_value: number;
  low_stock_count: number;
  out_of_stock_count: number;
  movements_today: number;
  top_products: { id: number; name: string; stock: number; sku: string }[];
  recent_movements: {
    id: number;
    type: MovementType;
    quantity: number;
    stock_after: number;
    reason?: string;
    created_at: string;
    product_name: string;
  }[];
  stock_by_category: { category: string; total_stock: number }[];
}
