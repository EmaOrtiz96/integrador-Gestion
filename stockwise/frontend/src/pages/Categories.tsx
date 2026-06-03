import { useState } from 'react';
import { Plus, Trash2, Tags, X } from 'lucide-react';
import { useCategories, useCreateCategory, useDeleteCategory } from '../hooks/useStock';

export default function Categories() {
  const { data: categories = [], isLoading } = useCategories();
  const createCat = useCreateCategory();
  const deleteCat = useDeleteCategory();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const handleCreate = async () => {
    await createCat.mutateAsync(form);
    setForm({ name: '', description: '' });
    setModal(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Categorías</h1>
          <p className="page-subtitle">{categories.length} categoría{categories.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={15} /> Nueva Categoría</button>
      </div>

      {isLoading ? <div className="spinner" /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {categories.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <Tags size={32} />
              <p>No hay categorías aún. Creá la primera.</p>
            </div>
          )}
          {categories.map(c => (
            <div key={c.id} className="card" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <Tags size={14} color="var(--accent)" />
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                  </div>
                  {c.description && <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{c.description}</p>}
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                    #{c.id} · {new Date(c.created_at).toLocaleDateString('es-AR')}
                  </p>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => { if (confirm(`¿Eliminar "${c.name}"?`)) deleteCat.mutate(c.id); }}
                  title="Eliminar"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
              <h2 className="modal-title" style={{ marginBottom: 0 }}>+ Nueva Categoría</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(false)}><X size={14} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: Electrónica, Alimentos…" autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descripción opcional…" />
              </div>
            </div>
            <div className="flex gap-2" style={{ marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={!form.name}>Crear Categoría</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
