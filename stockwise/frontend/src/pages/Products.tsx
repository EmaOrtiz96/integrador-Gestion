import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, ArrowUpDown, X } from 'lucide-react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useCategories, useCreateMovement } from '../hooks/useStock';
import type { Product, MovementType } from '../types';

type Modal = 'create' | 'edit' | 'movement' | null;

export default function Products() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [lowStock, setLowStock] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [selected, setSelected] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useProducts({
    search: search || undefined,
    category_id: catFilter ? Number(catFilter) : undefined,
    low_stock: lowStock || undefined,
  });
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const createMovement = useCreateMovement();

  // Form state
  const [form, setForm] = useState({ name: '', sku: '', description: '', price: 0, stock: 0, stock_min: 5, unit: 'unidad', category_id: '' });
  const [movForm, setMovForm] = useState<{ type: MovementType; quantity: number; reason: string }>({ type: 'entrada', quantity: 1, reason: '' });

  const openCreate = () => {
    setForm({ name: '', sku: '', description: '', price: 0, stock: 0, stock_min: 5, unit: 'unidad', category_id: '' });
    setModal('create');
  };
  const openEdit = (p: Product) => {
    setSelected(p);
    setForm({ name: p.name, sku: p.sku, description: p.description || '', price: p.price, stock: p.stock, stock_min: p.stock_min, unit: p.unit, category_id: p.category_id ? String(p.category_id) : '' });
    setModal('edit');
  };
  const openMovement = (p: Product) => { setSelected(p); setMovForm({ type: 'entrada', quantity: 1, reason: '' }); setModal('movement'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleCreate = async () => {
    await createProduct.mutateAsync({ ...form, price: Number(form.price), stock: Number(form.stock), stock_min: Number(form.stock_min), category_id: form.category_id ? Number(form.category_id) : undefined });
    closeModal();
  };
  const handleUpdate = async () => {
    if (!selected) return;
    await updateProduct.mutateAsync({ id: selected.id, data: { ...form, price: Number(form.price), stock_min: Number(form.stock_min), category_id: form.category_id ? Number(form.category_id) : undefined } });
    closeModal();
  };
  const handleMovement = async () => {
    if (!selected) return;
    await createMovement.mutateAsync({ product_id: selected.id, ...movForm, quantity: Number(movForm.quantity) });
    closeModal();
  };

  const stockBadge = (p: Product) => {
    if (p.stock === 0) return <span className="badge badge-red">Sin stock</span>;
    if (p.stock <= p.stock_min) return <span className="badge badge-warn">Stock bajo</span>;
    return <span className="badge badge-green">OK</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Productos</h1>
          <p className="page-subtitle">{products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={15} /> Nuevo Producto</button>
      </div>

      <div className="filters-row">
        <div className="search-bar" style={{ maxWidth: '300px' }}>
          <Search size={14} color="var(--text-dim)" />
          <input placeholder="Buscar nombre o SKU…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <input type="checkbox" checked={lowStock} onChange={e => setLowStock(e.target.checked)} style={{ width: 'auto' }} />
          Solo stock bajo
        </label>
      </div>

      {isLoading ? <div className="spinner" /> : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>SKU</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Mín.</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && (
                  <tr><td colSpan={8} className="empty-state">No se encontraron productos</td></tr>
                )}
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <span style={{ fontWeight: 500 }}>{p.name}</span>
                      {p.description && <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{p.description.slice(0, 40)}{p.description.length > 40 ? '…' : ''}</div>}
                    </td>
                    <td><span className="text-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.sku}</span></td>
                    <td>{p.category ? <span className="badge badge-purple">{p.category.name}</span> : <span className="text-muted">—</span>}</td>
                    <td><span className="text-mono">${p.price.toLocaleString('es-AR')}</span></td>
                    <td><span className="text-mono" style={{ fontWeight: 700, color: p.stock === 0 ? 'var(--danger)' : p.stock <= p.stock_min ? 'var(--warn)' : 'var(--accent)' }}>{p.stock} {p.unit}</span></td>
                    <td><span className="text-mono" style={{ color: 'var(--text-dim)' }}>{p.stock_min}</span></td>
                    <td>{stockBadge(p)}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm" onClick={() => openMovement(p)} title="Registrar movimiento"><ArrowUpDown size={13} /></button>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)} title="Editar"><Edit2 size={13} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => { if (confirm(`¿Eliminar "${p.name}"?`)) deleteProduct.mutate(p.id); }} title="Eliminar"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit modal */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
              <h2 className="modal-title" style={{ marginBottom: 0 }}>{modal === 'create' ? '+ Nuevo Producto' : 'Editar Producto'}</h2>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}><X size={14} /></button>
            </div>
            <div className="form-grid">
              <div className="form-group full">
                <label className="form-label">Nombre *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: Harina 000" />
              </div>
              <div className="form-group">
                <label className="form-label">SKU *</label>
                <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="HAR-001" disabled={modal === 'edit'} />
              </div>
              <div className="form-group">
                <label className="form-label">Unidad</label>
                <input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="kg, litro, unidad…" />
              </div>
              <div className="form-group">
                <label className="form-label">Precio ($)</label>
                <input type="number" min={0} value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock inicial</label>
                <input type="number" min={0} value={form.stock} onChange={e => setForm({ ...form, stock: +e.target.value })} disabled={modal === 'edit'} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock mínimo</label>
                <input type="number" min={0} value={form.stock_min} onChange={e => setForm({ ...form, stock_min: +e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                  <option value="">Sin categoría</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group full">
                <label className="form-label">Descripción</label>
                <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descripción opcional…" />
              </div>
            </div>
            <div className="flex gap-2" style={{ marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-primary" onClick={modal === 'create' ? handleCreate : handleUpdate} disabled={!form.name || !form.sku}>
                {modal === 'create' ? 'Crear Producto' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movement modal */}
      {modal === 'movement' && selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
              <h2 className="modal-title" style={{ marginBottom: 0 }}>Registrar Movimiento</h2>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}><X size={14} /></button>
            </div>
            <div style={{ marginBottom: '1.25rem', padding: '0.75rem', background: 'var(--accent-dim)', borderRadius: 8, border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Producto</div>
              <div style={{ fontWeight: 600 }}>{selected.name}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Stock actual: <span className="text-mono" style={{ color: 'var(--accent)' }}>{selected.stock} {selected.unit}</span></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Tipo</label>
                <select value={movForm.type} onChange={e => setMovForm({ ...movForm, type: e.target.value as MovementType })}>
                  <option value="entrada">↑ Entrada</option>
                  <option value="salida">↓ Salida</option>
                  <option value="ajuste">= Ajuste manual</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{movForm.type === 'ajuste' ? 'Nuevo stock' : 'Cantidad'}</label>
                <input type="number" min={1} value={movForm.quantity} onChange={e => setMovForm({ ...movForm, quantity: +e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Motivo (opcional)</label>
                <input value={movForm.reason} onChange={e => setMovForm({ ...movForm, reason: e.target.value })} placeholder="Ej: Compra proveedor, venta, inventario…" />
              </div>
            </div>
            <div className="flex gap-2" style={{ marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleMovement} disabled={movForm.quantity <= 0}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
