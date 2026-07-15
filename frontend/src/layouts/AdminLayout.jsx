import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, ArrowLeft, LogOut, Settings, CheckCircle2, Image } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const AdminLayout = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Banners', path: '/admin/banners', icon: Image },
        { name: 'Seller Applications', path: '/admin/seller-applications', icon: CheckCircle2 },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--brand-dark)', display: 'flex', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Sidebar */}
            <aside style={{ width: 240, background: '#09080f', borderRight: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100%', zIndex: 20 }}>
                <div style={{ padding: '28px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, background: '#6366f1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}>SS</div>
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', fontFamily: "'Space Grotesk', sans-serif" }}>Admin Panel</span>
                    </Link>
                </div>

                <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {menuItems.map(item => {
                        const active = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path} style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '10px 14px', borderRadius: 10, textDecoration: 'none',
                                fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                                background: active ? '#6366f1' : 'transparent',
                                color: active ? '#fff' : 'var(--text-secondary)',
                                transition: 'all 0.2s ease',
                                boxShadow: active ? '0 4px 12px rgba(99,102,241,0.2)' : 'none'
                            }}
                                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#fff'; } }}
                                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
                            >
                                <item.icon size={16} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, textDecoration: 'none', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <ArrowLeft size={16} /> Back to Store
                    </Link>
                    <button onClick={() => dispatch(logout())} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: 'none', border: 'none', fontSize: 12, fontWeight: 700, color: '#f43f5e', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em', width: '100%', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main style={{ flex: 1, marginLeft: 240, padding: '40px 48px', minHeight: '100vh' }}>
                <header style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <p style={{ fontSize: 10, color: '#818cf8', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>SmartShop</p>
                        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', fontFamily: "'Space Grotesk', sans-serif" }}>
                            {menuItems.find(m => m.path === location.pathname)?.name || 'Admin'}
                        </h1>
                    </div>
                    <Link to="/admin/settings" style={{ width: 44, height: 44, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#fff'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                        <Settings size={18} />
                    </Link>
                </header>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;

