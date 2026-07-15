import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, ShoppingBag, User, ChevronDown, Mic, Heart, X } from 'lucide-react';
import { selectCartCount } from '../store/slices/cartSlice';
import { logout } from '../store/slices/authSlice';
import { setStatus } from '../store/slices/productSlice';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartCount = useSelector(selectCartCount);
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchKeyword.trim()) {
            navigate(`/search/${searchKeyword.trim()}`);
            setSearchKeyword('');
        }
    };

    return (
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, background: 'rgba(7, 7, 12, 0.85)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(99, 102, 241, 0.08)' }}>
            {/* Top strip */}
            <div style={{ background: 'linear-gradient(90deg, #4f46e5 0%, #6366f1 50%, #10b981 100%)', padding: '6px 0', textAlign: 'center' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'center', gap: 32 }}>
                    {[
                        { label: 'Free Delivery on Orders Over Rs. 2,000', link: '/shipping' },
                        { label: 'Sell on SmartShop', link: '/sell-on-smartshop' },
                        { label: 'Track Order', link: '/track-order' },
                    ].map(item => (
                        <Link key={item.label} to={item.link} style={{ color: '#fff', fontSize: 11, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.95 }}>
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main nav */}
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 24, height: 64 }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', fontFamily: "'Space Grotesk', sans-serif" }}>
                        Smart<span style={{ color: '#6366f1', background: 'linear-gradient(135deg, #818cf8, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Shop</span>
                    </span>
                </Link>

                {/* Search */}
                <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 520, position: 'relative' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        background: 'rgba(15, 14, 23, 0.8)', border: `1px solid ${searchFocused ? '#6366f1' : 'rgba(255, 255, 255, 0.08)'}`,
                        borderRadius: 10, overflow: 'hidden', transition: 'all 0.25s ease',
                        boxShadow: searchFocused ? '0 0 0 3px rgba(99, 102, 241, 0.15)' : 'none'
                    }}>
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={e => setSearchKeyword(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            placeholder="Search products, brands..."
                            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '10px 16px', color: '#fff', fontSize: 14 }}
                        />
                        {searchKeyword && (
                            <button type="button" onClick={() => setSearchKeyword('')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0 8px' }}>
                                <X size={14} />
                            </button>
                        )}
                        <button type="submit" style={{ background: '#6366f1', border: 'none', padding: '10px 18px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', transition: 'background 0.2s' }}>
                            <Search size={16} />
                        </button>
                    </div>
                </form>

                {/* Voice button */}
                <button
                    onClick={() => dispatch(setStatus('listening'))}
                    title="Voice Search"
                    style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.25)',
                        color: '#6366f1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                        e.currentTarget.style.borderColor = '#6366f1';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.12)';
                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.25)';
                    }}
                >
                    <Mic size={16} />
                </button>

                {/* Nav links */}
                <div style={{ display: 'flex', gap: 24, flexShrink: 0 }}>
                    {['Electronics', 'Fashion', 'Home', 'Beauty'].map(cat => (
                        <Link key={cat} to={`/category/${cat.toLowerCase()}`} style={{ color: '#cbd5e1', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.target.style.color = '#6366f1'}
                            onMouseLeave={e => e.target.style.color = '#cbd5e1'}
                        >{cat}</Link>
                    ))}
                </div>

                {/* Right icons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
                    <Link to="/profile" style={{ color: '#64748b', display: 'flex', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#64748b'} title="Wishlist">
                        <Heart size={20} />
                    </Link>

                    {isAuthenticated ? (
                        <div style={{ position: 'relative' }}
                            onMouseEnter={() => setProfileOpen(true)}
                            onMouseLeave={() => setProfileOpen(false)}
                        >
                            <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}>
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <ChevronDown size={14} style={{ color: '#64748b', transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            </button>

                            {profileOpen && (
                                <div style={{
                                    position: 'absolute', top: '100%', right: 0, marginTop: 8,
                                    background: 'rgba(15, 14, 23, 0.95)', border: '1px solid rgba(99, 102, 241, 0.15)', borderRadius: 12,
                                    width: 220, zIndex: 10000, overflow: 'hidden', animation: 'fadeIn 0.2s ease',
                                    backdropFilter: 'blur(16px)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                                }}>
                                    <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{user?.name}</p>
                                        <p style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{user?.email}</p>
                                    </div>
                                    {[
                                        user?.role === 'admin' && { label: 'Admin Dashboard', link: '/admin', color: '#6366f1' },
                                        user?.role === 'seller' && { label: 'Seller Dashboard', link: '/seller/dashboard', color: '#10b981' },
                                        user?.role === 'seller_pending' && { label: 'Application Status', link: '/seller/application-status', color: '#64748b' },
                                        user?.role === 'buyer' && { label: 'Become a Seller', link: '/sell-on-smartshop', color: '#10b981' },
                                        { label: 'My Profile', link: '/profile', color: '#cbd5e1' },
                                        { label: 'My Orders', link: '/profile', color: '#cbd5e1' },
                                    ].filter(Boolean).map((item, i) => (
                                        <Link key={i} to={item.link} style={{ display: 'block', padding: '10px 16px', fontSize: 13, color: item.color, textDecoration: 'none', transition: 'background 0.15s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >{item.label}</Link>
                                    ))}
                                    <button onClick={() => { dispatch(logout()); setProfileOpen(false); }}
                                        style={{ display: 'block', width: '100%', padding: '10px 16px', fontSize: 13, color: '#f43f5e', background: 'none', border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}>
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cbd5e1', textDecoration: 'none', fontSize: 13, fontWeight: 600, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#6366f1'} onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}>
                            <User size={18} />
                            Login
                        </Link>
                    )}

                    <Link to="/cart" style={{ position: 'relative', color: '#cbd5e1', display: 'flex', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#6366f1'} onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}>
                        <ShoppingBag size={22} style={{ color: cartCount > 0 ? '#10b981' : '#cbd5e1' }} />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute', top: -6, right: -8,
                                background: '#10b981', color: '#fff', fontSize: 10, fontWeight: 700,
                                width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 2px 6px rgba(16,185,129,0.3)'
                            }}>{cartCount}</span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
