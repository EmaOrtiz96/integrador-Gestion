import { ArrowUpCircle, ArrowDownCircle, Settings2 } from 'lucide-react';
import { useMovements } from '../hooks/useStock';
import type { MovementType } from '../types';

const typeConfig: Record<MovementType, { label: string; icon: any; badge: string }> = {
  entrada: { label: 'Entrada', icon: ArrowUpCircle, badge: 'badge-green' },
  salida: { label: 'Salida', icon: ArrowDownCircle, badge: 'badge-red' },
  ajuste: { label: 'Ajuste', icon: Settings2, badge: 'badge-warn' },
};

export default function Movements() {
  const { data: movements = [], isLoading } = useMovements();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Movimientos</h1>
          <p className="page-subtitle">Historial completo de entradas, salidas y ajustes</p>
        </div>
      </div>

      {isLoading ? <div className="spinner" /> : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Stock antes</th>
                  <th>Stock después</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {movements.length === 0 && (
                  <tr><td colSpan={8} className="empty-state">Sin movimientos aún. Registrá el primero desde la sección Productos.</td></tr>
                )}
                {movements.map(m => {
                  const cfg = typeConfig[m.type];
                  const Icon = cfg.icon;
                  return (
                    <tr key={m.id}>
                      <td><span className="text-mono" style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>#{m.id}</span></td>
                      <td>
                        <div style={{ fontSize: '0.82rem' }}>{new Date(m.created_at).toLocaleDateString('es-AR')}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                          {new Date(m.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 500 }}>{m.product?.name || `#${m.product_id}`}</span>
                        {m.product?.sku && <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{m.product.sku}</div>}
                      </td>
                      <td>
                        <span className={`badge ${cfg.badge}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Icon size={11} />
                          {cfg.label}
                        </span>
                      </td>
                      <td>
                        <span className="text-mono" style={{ fontWeight: 700 }}>
                          {m.type === 'entrada' ? '+' : m.type === 'salida' ? '-' : '='}{m.quantity}
                        </span>
                      </td>
                      <td><span className="text-mono" style={{ color: 'var(--text-muted)' }}>{m.stock_before}</span></td>
                      <td><span className="text-mono" style={{ color: 'var(--accent)' }}>{m.stock_after}</span></td>
                      <td><span style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>{m.reason || '—'}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
