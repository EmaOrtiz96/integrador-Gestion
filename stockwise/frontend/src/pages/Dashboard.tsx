import { useStats } from '../hooks/useStock';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Package, TrendingUp, AlertTriangle, XCircle, Activity, ArrowUpCircle, ArrowDownCircle, Settings2 } from 'lucide-react';

const movColors: Record<string, string> = {
  entrada: 'var(--success)',
  salida: 'var(--danger)',
  ajuste: 'var(--warn)',
};

const movIcons: Record<string, any> = {
  entrada: ArrowUpCircle,
  salida: ArrowDownCircle,
  ajuste: Settings2,
};

export default function Dashboard() {
  const { data: stats, isLoading } = useStats();

  if (isLoading) return <div className="spinner" />;
  if (!stats) return <p className="text-muted">Sin datos.</p>;

  const chartData = stats.stock_by_category.map(c => ({
    name: c.category.length > 10 ? c.category.slice(0, 10) + '…' : c.category,
    stock: c.total_stock,
  }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Resumen general del inventario</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="label">Productos</span>
          <span className="value">{stats.total_products}</span>
          <span className="sub">en sistema</span>
        </div>
        <div className="stat-card">
          <span className="label">Valor total</span>
          <span className="value" style={{ fontSize: '1.4rem' }}>
            ${stats.total_stock_value.toLocaleString('es-AR', { minimumFractionDigits: 0 })}
          </span>
          <span className="sub">en stock</span>
        </div>
        <div className="stat-card" style={{ borderColor: stats.low_stock_count > 0 ? 'var(--warn)' : undefined }}>
          <span className="label">Stock bajo</span>
          <span className="value" style={{ color: stats.low_stock_count > 0 ? 'var(--warn)' : 'var(--accent)' }}>
            {stats.low_stock_count}
          </span>
          <span className="sub">productos con alerta</span>
        </div>
        <div className="stat-card" style={{ borderColor: stats.out_of_stock_count > 0 ? 'var(--danger)' : undefined }}>
          <span className="label">Sin stock</span>
          <span className="value" style={{ color: stats.out_of_stock_count > 0 ? 'var(--danger)' : 'var(--accent)' }}>
            {stats.out_of_stock_count}
          </span>
          <span className="sub">productos agotados</span>
        </div>
        <div className="stat-card">
          <span className="label">Movimientos hoy</span>
          <span className="value">{stats.movements_today}</span>
          <span className="sub">registros del día</span>
        </div>
      </div>

      <div className="two-col">
        {/* Chart */}
        <div className="card">
          <p className="section-title">Stock por categoría</p>
          {chartData.length === 0 ? (
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Sin categorías aún</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={28}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'DM Sans' }}
                  labelStyle={{ color: 'var(--text-muted)' }}
                  itemStyle={{ color: 'var(--accent)' }}
                />
                <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={i % 2 === 0 ? 'var(--accent)' : '#7c3aed'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top products */}
        <div className="card">
          <p className="section-title">Top productos por stock</p>
          {stats.top_products.length === 0 ? (
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Sin productos</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.top_products.map((p, i) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', width: '16px' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: '0.88rem' }}>{p.name}</span>
                  </div>
                  <span className="badge badge-accent">{p.stock} u.</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent movements */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <p className="section-title">Movimientos recientes</p>
        {stats.recent_movements.length === 0 ? (
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>Sin movimientos registrados</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {stats.recent_movements.map(m => {
              const Icon = movIcons[m.type] || Activity;
              return (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <Icon size={16} style={{ color: movColors[m.type], flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '0.88rem' }}>{m.product_name}</span>
                  <span className={`badge badge-${m.type === 'entrada' ? 'green' : m.type === 'salida' ? 'red' : 'warn'}`}>
                    {m.type === 'entrada' ? '+' : m.type === 'salida' ? '-' : '='}{m.quantity}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                    {new Date(m.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
