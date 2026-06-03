import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/client';
import type { MovementCreate } from '../types';
import toast from 'react-hot-toast';

// ── Dashboard ─────────────────────────────────────────────
export const useStats = () =>
  useQuery({ queryKey: ['stats'], queryFn: api.fetchStats, refetchInterval: 30000 });

// ── Products ──────────────────────────────────────────────
export const useProducts = (params?: { search?: string; category_id?: number; low_stock?: boolean }) =>
  useQuery({ queryKey: ['products', params], queryFn: () => api.fetchProducts(params) });

export const useProduct = (id: number) =>
  useQuery({ queryKey: ['product', id], queryFn: () => api.fetchProduct(id), enabled: !!id });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createProduct,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['stats'] }); toast.success('Producto creado ✅'); },
    onError: (e: any) => toast.error(e.response?.data?.detail || 'Error al crear producto'),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateProduct(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); toast.success('Producto actualizado ✅'); },
    onError: (e: any) => toast.error(e.response?.data?.detail || 'Error al actualizar'),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteProduct,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['stats'] }); toast.success('Producto eliminado'); },
    onError: () => toast.error('Error al eliminar'),
  });
};

// ── Categories ────────────────────────────────────────────
export const useCategories = () =>
  useQuery({ queryKey: ['categories'], queryFn: api.fetchCategories });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createCategory,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); toast.success('Categoría creada ✅'); },
    onError: (e: any) => toast.error(e.response?.data?.detail || 'Error'),
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteCategory,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); toast.success('Categoría eliminada'); },
  });
};

// ── Movements ─────────────────────────────────────────────
export const useMovements = (product_id?: number) =>
  useQuery({ queryKey: ['movements', product_id], queryFn: () => api.fetchMovements(product_id ? { product_id } : undefined) });

export const useCreateMovement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MovementCreate) => api.createMovement(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['movements'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Movimiento registrado ✅');
    },
    onError: (e: any) => toast.error(e.response?.data?.detail || 'Error'),
  });
};
