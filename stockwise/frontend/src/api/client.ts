import axios from 'axios';
import type { Product, Category, Movement, MovementCreate, DashboardStats } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Dashboard
export const fetchStats = () =>
  api.get<DashboardStats>('/dashboard/stats').then(r => r.data);

// Products
export const fetchProducts = (params?: {
  search?: string;
  category_id?: number;
  low_stock?: boolean;
}) => api.get<Product[]>('/products', { params }).then(r => r.data);

export const fetchProduct = (id: number) =>
  api.get<Product>(`/products/${id}`).then(r => r.data);

export const createProduct = (data: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'>) =>
  api.post<Product>('/products', data).then(r => r.data);

export const updateProduct = (id: number, data: Partial<Product>) =>
  api.put<Product>(`/products/${id}`, data).then(r => r.data);

export const deleteProduct = (id: number) =>
  api.delete(`/products/${id}`);

// Categories
export const fetchCategories = () =>
  api.get<Category[]>('/categories').then(r => r.data);

export const createCategory = (data: { name: string; description?: string }) =>
  api.post<Category>('/categories', data).then(r => r.data);

export const deleteCategory = (id: number) =>
  api.delete(`/categories/${id}`);

// Movements
export const fetchMovements = (params?: { product_id?: number }) =>
  api.get<Movement[]>('/movements', { params }).then(r => r.data);

export const createMovement = (data: MovementCreate) =>
  api.post<Movement>('/movements', data).then(r => r.data);
