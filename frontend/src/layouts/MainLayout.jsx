import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import VoiceOverlay from '../components/VoiceOverlay';

const MainLayout = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--brand-dark)', overflowX: 'hidden' }}>
            <Navbar />

            {/* Spacer for fixed navbar (announcement bar ~32px + nav ~64px) */}
            <div style={{ height: 96 }} />

            <main style={{ flex: 1, width: '100%' }}>
                <Outlet />
            </main>

            {/* Footer */}
            <footer style={{ background: '#09080f', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: 60, paddingBottom: 40 }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 48, paddingBottom: 48, borderBottom: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: 32 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

                        {/* Brand */}
                        <div>
                            <Link to="/" style={{ textDecoration: 'none' }}>
                                <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', fontFamily: "'Space Grotesk', sans-serif" }}>
                                    Smart<span style={{ color: '#6366f1', background: 'linear-gradient(135deg, #818cf8, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Shop</span>
                                </span>
                            </Link>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.7 }}>
                                Pakistan's first AI voice-powered shopping platform. Say anything. Find everything.
                            </p>
                            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                                {['f', 't', 'i'].map((s, i) => (
                                    <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}>{s}</div>
                                ))}
                            </div>
                        </div>

                        {/* Customer Care */}
                        <div>
                            <h4 style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20, fontFamily: "'Space Grotesk', sans-serif" }}>Customer Care</h4>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {[
                                    { label: 'Shipping & Delivery', to: '/shipping' },
                                    { label: 'Returns & Refunds', to: '/returns' },
                                    { label: 'Track Order', to: '/track-order' },
                                    { label: 'Terms & Conditions', to: '/terms' },
                                ].map(l => (
                                    <li key={l.label}><Link to={l.to} style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.target.style.color = '#6366f1'}
                                        onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                                    >{l.label}</Link></li>
                                ))}
                            </ul>
                        </div>

                        {/* SmartShop */}
                        <div>
                            <h4 style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20, fontFamily: "'Space Grotesk', sans-serif" }}>SmartShop</h4>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {[
                                    { label: 'About Us', to: '/about' },
                                    { label: 'Sell on SmartShop', to: '/sell-on-smartshop' },
                                    { label: 'My Account', to: '/profile' },
                                    { label: 'Privacy Policy', to: '/privacy' },
                                ].map(l => (
                                    <li key={l.label}><Link to={l.to} style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.target.style.color = '#6366f1'}
                                        onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                                    >{l.label}</Link></li>
                                ))}
                            </ul>
                        </div>

                        {/* Categories */}
                        <div>
                            <h4 style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20, fontFamily: "'Space Grotesk', sans-serif" }}>Categories</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
                                {['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Books'].map(c => (
                                    <Link key={c} to={`/category/${c.toLowerCase()}`} style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.target.style.color = '#6366f1'}
                                        onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                                    >{c}</Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>© 2026 SmartShop Pakistan. All rights reserved.</p>
                        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Visa / Mastercard / COD</span>
                            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Voice AI Commerce</span>
                        </div>
                    </div>
                </div>
            </footer>
            <VoiceOverlay />
        </div>
    );
};

export default MainLayout;
;
