import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, ArrowLeftRight, BarChart3 } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Movements from './pages/Movements';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Productos' },
  { to: '/categories', icon: Tags, label: 'Categorías' },
  { to: '/movements', icon: ArrowLeftRight, label: 'Movimientos' },
];

export default function App() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">Stock<span>Wise</span></div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', padding: '0 0.75rem' }}>
            v1.0.0 · IA-Assisted
          </div>
        </div>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/movements" element={<Movements />} />
        </Routes>
      </main>
    </div>
  );
}
