import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { setStatus } from '../store/slices/productSlice';
import ProductCard from '../components/ui/ProductCard';
import { Link } from 'react-router-dom';
import { Mic, ArrowRight, Zap, Star, TrendingUp } from 'lucide-react';
import axios from 'axios';

const useBanners = () => {
    const [banners, setBanners] = useState([]);
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        axios.get('/api/banners').then(r => setBanners(r.data)).catch(() => {});
    }, []);
    useEffect(() => {
        if (banners.length < 2) return;
        const t = setInterval(() => setIdx(i => (i + 1) % banners.length), 4000);
        return () => clearInterval(t);
    }, [banners.length]);
    return { banners, idx, setIdx };
};

const useFlashSale = () => {
    const [saleActive, setSaleActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
    const timerRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await axios.get('/api/flash-sale');
                if (!data?.isActive || !data?.endTime) return;
                const end = new Date(data.endTime).getTime();
                const tick = () => {
                    const diff = end - Date.now();
                    if (diff <= 0) { setSaleActive(false); clearInterval(timerRef.current); return; }
                    setSaleActive(true);
                    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
                    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
                    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
                    setTimeLeft({ h, m, s });
                };
                tick();
                timerRef.current = setInterval(tick, 1000);
            } catch {}
        };
        load();
        return () => clearInterval(timerRef.current);
    }, []);

    return { saleActive, timeLeft };
};

const categories = [
    { name: 'Electronics', slug: 'electronics', emoji: '📱', desc: 'Phones, Laptops & More' },
    { name: 'Fashion', slug: 'fashion', emoji: '👟', desc: 'Clothing & Shoes' },
    { name: 'Home & Living', slug: 'home', emoji: '🛋️', desc: 'Furniture & Decor' },
    { name: 'Beauty', slug: 'beauty', emoji: '💄', desc: 'Skincare & Makeup' },
    { name: 'Sports', slug: 'sports', emoji: '⚽', desc: 'Equipment & Gear' },
    { name: 'Books', slug: 'books', emoji: '📚', desc: 'Books & Stationery' },
];

const voiceExamples = [
    'Find me wireless earbuds under Rs. 5,000',
    'Show laptops under 80,000',
    'Search for Nike shoes',
    'Go to my cart',
    'Show me beauty products',
];

const HomePage = () => {
    const dispatch = useDispatch();
    const { items, status } = useSelector(state => state.products);
    const [activeCategory, setActiveCategory] = useState('all');
    const [voiceExample, setVoiceExample] = useState(0);
    const { saleActive, timeLeft } = useFlashSale();
    const { banners, idx, setIdx } = useBanners();

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        const timer = setInterval(() => {
            setVoiceExample(prev => (prev + 1) % voiceExamples.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const flashProducts = [...items].slice(0, 8);
    const trendingProducts = [...items].slice(0, 12);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--brand-dark)' }}>
            <style>{`
                @keyframes pulse-ring {
                    0% { transform: scale(0.95); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                    100% { transform: scale(0.95); opacity: 0.5; }
                }
                @keyframes bounce-bar {
                    0% { height: 6px; }
                    100% { height: 24px; }
                }
                .soundbar-1 { animation: bounce-bar 0.6s ease-in-out infinite alternate; }
                .soundbar-2 { animation: bounce-bar 0.8s ease-in-out infinite alternate 0.15s; }
                .soundbar-3 { animation: bounce-bar 0.5s ease-in-out infinite alternate 0.3s; }
                .soundbar-4 { animation: bounce-bar 0.9s ease-in-out infinite alternate 0.1s; }
                .soundbar-5 { animation: bounce-bar 0.7s ease-in-out infinite alternate 0.25s; }
            `}</style>

            {/* Hero Section */}
            <section style={{
                position: 'relative',
                background: 'radial-gradient(circle at 75% 20%, rgba(99,102,241,0.06) 0%, transparent 60%), var(--brand-dark)',
                overflow: 'hidden'
            }} className="border-b border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[660px] items-center gap-12 p-6 sm:p-12 lg:p-16">
                    {/* Left - Text */}
                    <div className="col-span-1 lg:col-span-7 flex flex-col justify-center gap-7">
                        <div>
                            <span style={{ 
                                fontSize: 10, 
                                background: 'rgba(99,102,241,0.08)',
                                color: '#818cf8', 
                                border: '1px solid rgba(99,102,241,0.2)',
                                fontWeight: 700, 
                                letterSpacing: '0.25em', 
                                textTransform: 'uppercase',
                                padding: '5px 14px',
                                borderRadius: 100
                            }}>
                                AI-Powered Marketplace — Pakistan
                            </span>
                        </div>
                        
                        <h1 style={{ 
                            fontFamily: "'Space Grotesk', sans-serif", 
                            fontWeight: 800, 
                            lineHeight: 1.05, 
                            color: '#fff', 
                            letterSpacing: '-0.03em' 
                        }} className="text-5xl sm:text-6xl lg:text-[72px]">
                            Shop with<br />your <span style={{ 
                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>Voice.</span>
                        </h1>
                        
                        <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }} className="max-w-lg">
                            Say anything. Find everything. The most intelligent shopping experience in Pakistan, powered by Google Gemini AI.
                        </p>

                        {/* Soundwave Interactive Ticker */}
                        <div className="w-full max-w-md bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center gap-4 shadow-xl backdrop-blur-md">
                            <div className="flex items-center gap-1 h-6 w-12 justify-center flex-shrink-0">
                                <span className="w-1 bg-[#6366f1] rounded-full soundbar-1" style={{ height: 12 }}></span>
                                <span className="w-1 bg-[#6366f1] rounded-full soundbar-2" style={{ height: 18 }}></span>
                                <span className="w-1 bg-[#10b981] rounded-full soundbar-3" style={{ height: 10 }}></span>
                                <span className="w-1 bg-[#6366f1] rounded-full soundbar-4" style={{ height: 22 }}></span>
                                <span className="w-1 bg-[#10b981] rounded-full soundbar-5" style={{ height: 14 }}></span>
                            </div>
                            <span style={{ fontSize: 13, color: '#cbd5e1', fontStyle: 'italic', flex: 1 }}>
                                "{voiceExamples[voiceExample]}"
                            </span>
                            <span style={{ 
                                fontSize: 9, 
                                color: '#6366f1', 
                                background: 'rgba(99,102,241,0.08)',
                                border: '1px solid rgba(99,102,241,0.2)',
                                borderRadius: 6,
                                padding: '4px 9px',
                                fontWeight: 800, 
                                letterSpacing: '0.08em', 
                                textTransform: 'uppercase', 
                                flexShrink: 0 
                            }}>
                                Try it
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                            <button
                                onClick={() => dispatch(setStatus('listening'))}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    gap: 10, 
                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: 12, 
                                    padding: '16px 32px', 
                                    fontSize: 13, 
                                    fontWeight: 700, 
                                    cursor: 'pointer', 
                                    letterSpacing: '0.04em',
                                    boxShadow: '0 4px 20px rgba(99,102,241,0.25)',
                                    transition: 'all 0.25s'
                                }}
                                className="hover:scale-[1.02] hover:brightness-110"
                            >
                                <Mic size={16} /> Start Voice Shopping
                            </button>
                            <Link to="/search/all" style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: 6, 
                                color: '#cbd5e1', 
                                textDecoration: 'none', 
                                fontSize: 13, 
                                fontWeight: 700, 
                                padding: '16px 26px', 
                                border: '1px solid rgba(255,255,255,0.08)', 
                                borderRadius: 12,
                                background: 'rgba(255,255,255,0.02)',
                                transition: 'all 0.2s'
                            }} className="hover:border-white/20 hover:text-white hover:background-white/5">
                                Browse All <ArrowRight size={14} />
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 pt-7 border-t border-white/5 mt-3 max-w-md lg:max-w-lg">
                            {[{ val: '50K+', label: 'Products' }, { val: '99.8%', label: 'Satisfaction' }, { val: 'Free', label: 'Delivery' }].map(s => (
                                <div key={s.label} className="flex flex-col">
                                    <p style={{ fontSize: 24, fontWeight: 800, color: '#fff', lineHeight: 1, fontFamily: "'Space Grotesk', sans-serif" }}>{s.val}</p>
                                    <p style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 6, fontWeight: 700 }}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right - Glassmorphic banner carousel / category panel */}
                    <div className="col-span-1 lg:col-span-5 relative bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-h-[380px] lg:min-h-[460px] flex flex-col justify-between backdrop-blur-lg">
                        {banners.length > 0 ? (
                            <div className="relative w-full h-full flex flex-col overflow-hidden flex-1">
                                {banners.map((b, i) => (
                                    <Link key={b._id} to={b.link || '/'} style={{
                                        display: i === idx ? 'block' : 'none', height: '100%', textDecoration: 'none', position: 'relative'
                                    }} className="w-full h-full flex-1">
                                        <img src={`http://localhost:5000${b.imageUrl}`} alt={b.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                        {/* Overlay */}
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,12,0.9) 0%, transparent 60%)' }} />
                                        {/* Text */}
                                        <div style={{ position: 'absolute', bottom: 28, left: 28, right: 28 }}>
                                            {b.badgeText && <span style={{ fontSize: 10, background: '#10b981', color: '#fff', borderRadius: 6, padding: '4px 10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, display: 'inline-block', boxShadow: '0 2px 6px rgba(16,185,129,0.3)' }}>{b.badgeText}</span>}
                                            {b.title && <h3 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginTop: 8, lineHeight: 1.2, fontFamily: "'Space Grotesk', sans-serif" }}>{b.title}</h3>}
                                            {b.subtitle && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>{b.subtitle}</p>}
                                        </div>
                                    </Link>
                                ))}
                                {/* Dots */}
                                {banners.length > 1 && (
                                    <div style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', gap: 6, zIndex: 10 }}>
                                        {banners.map((_, i) => (
                                            <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 20 : 6, height: 6, borderRadius: 3, background: i === idx ? '#6366f1' : 'rgba(255,255,255,0.3)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col h-full flex-1 p-6 justify-between">
                                {/* Header */}
                                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#a855f7] flex items-center justify-center font-bold text-white text-xs shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                        G
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white/5 rounded-full"></span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white tracking-wider">Gemini Neural Assistant</p>
                                        <p className="text-[9px] text-green-500 uppercase font-bold tracking-widest">Active & Listening</p>
                                    </div>
                                </div>

                                {/* Chat Body */}
                                <div className="flex flex-col gap-4 py-4 flex-1 justify-center">
                                    {/* User Bubble */}
                                    <div className="flex flex-col items-end gap-1.5 self-end max-w-[85%]">
                                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">User</span>
                                        <div className="bg-[#12111d] border border-white/5 rounded-2xl rounded-tr-none px-4 py-3 text-xs text-neutral-300 shadow-md">
                                            "Find the best wireless noise cancelling headphones"
                                        </div>
                                    </div>

                                    {/* Assistant Response */}
                                    <div className="flex flex-col items-start gap-1.5 max-w-[85%]">
                                        <span className="text-[9px] font-bold text-[#6366f1] uppercase tracking-widest">Gemini</span>
                                        <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-neutral-300 shadow-md">
                                            I found the <span className="text-[#818cf8] font-semibold">Sony WH-1000XM5</span>. It features industry-leading noise cancellation, LDAC Hi-Res audio, and 30-hour battery life.
                                        </div>
                                    </div>

                                    {/* Product Preview Card */}
                                    <div className="bg-[#0e0d16] border border-[#1d1b2e] rounded-xl p-3 shadow-2xl flex gap-3 items-center transform hover:scale-[1.02] transition-transform duration-300">
                                        <img 
                                            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&q=80" 
                                            alt="Sony WH-1000XM5" 
                                            className="w-16 h-16 rounded-lg object-cover bg-neutral-900 border border-white/5" 
                                        />
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[8px] bg-[#10b981]/10 text-[#10b981] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Top Recommendation</span>
                                            <h4 className="text-xs font-bold text-white truncate mt-1.5">Sony WH-1000XM5</h4>
                                            <p className="text-xs font-bold text-[#10b981] mt-1">Rs. 67,000</p>
                                        </div>
                                        <button 
                                            onClick={() => dispatch(setStatus('listening'))} 
                                            className="bg-[#6366f1] text-white p-2.5 rounded-lg hover:bg-indigo-600 transition-colors shadow-md active:scale-95 flex items-center justify-center"
                                        >
                                            <Mic size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Footer Waveform */}
                                <div className="border-t border-white/5 pt-3.5 flex items-center justify-between">
                                    <span className="text-[9px] text-neutral-500 font-mono tracking-widest uppercase">Console Mode: Connected</span>
                                    <div className="flex items-center gap-1 h-4">
                                        <span className="w-0.5 bg-[#6366f1] rounded-full soundbar-1" style={{ height: 6 }}></span>
                                        <span className="w-0.5 bg-[#6366f1] rounded-full soundbar-3" style={{ height: 10 }}></span>
                                        <span className="w-0.5 bg-[#10b981] rounded-full soundbar-2" style={{ height: 14 }}></span>
                                        <span className="w-0.5 bg-[#10b981] rounded-full soundbar-4" style={{ height: 8 }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Category pills */}
            <section style={{ padding: '20px 48px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 8, overflowX: 'auto' }} className="scrollbar-hide">
                <button
                    onClick={() => setActiveCategory('all')}
                    className={`tag ${activeCategory === 'all' ? 'active' : ''}`}
                >All Products</button>
                {categories.map(cat => (
                    <Link key={cat.slug} to={`/category/${cat.slug}`} className="tag">{cat.name}</Link>
                ))}
            </section>

            {/* Flash Sale */}
            {flashProducts.length > 0 && saleActive && (
            <section style={{ padding: '40px 48px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Zap size={20} style={{ color: '#10b981' }} />
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', fontFamily: "'Space Grotesk', sans-serif" }}>Flash Sale</h2>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ending in</span>
                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            {[timeLeft.h, timeLeft.m, timeLeft.s].map((v, i) => (
                                <React.Fragment key={i}>
                                    <span style={{ background: '#10b981', color: '#fff', borderRadius: 6, padding: '4px 10px', fontSize: 16, fontWeight: 800, fontVariantNumeric: 'tabular-nums', minWidth: 38, textAlign: 'center', boxShadow: '0 2px 8px rgba(16,185,129,0.25)' }}>{v}</span>
                                    {i < 2 && <span style={{ color: '#10b981', fontWeight: 800 }}>:</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <Link to="/search/all" style={{ fontSize: 12, color: '#10b981', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        View All <ArrowRight size={14} />
                    </Link>
                </div>
                <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }} className="scrollbar-hide">
                    {flashProducts.map((product, idx) => (
                        <div key={product._id} style={{ minWidth: 200, flexShrink: 0 }}>
                            <ProductCard product={product} />
                            <div style={{ marginTop: 8 }}>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${30 + (idx * 13) % 60}%` }} />
                                </div>
                                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{20 + idx * 11} sold</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            )}

            {/* All Categories row */}
            <section style={{ padding: '40px 48px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <TrendingUp size={18} style={{ color: '#6366f1' }} />
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', fontFamily: "'Space Grotesk', sans-serif" }}>Shop by Category</h2>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
                    {categories.map(cat => (
                        <Link key={cat.slug} to={`/category/${cat.slug}`} style={{
                            background: 'rgba(15, 14, 23, 0.7)', border: '1px solid rgba(99, 102, 241, 0.12)', borderRadius: 16, padding: '20px 16px',
                            textDecoration: 'none', textAlign: 'center', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', backdropFilter: 'blur(12px)'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = 'rgba(20, 19, 31, 0.9)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.12)'; e.currentTarget.style.background = 'rgba(15, 14, 23, 0.7)'; e.currentTarget.style.transform = 'none'; }}
                        >
                            <div style={{ fontSize: 32, marginBottom: 8 }}>{cat.emoji}</div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', letterSpacing: '0.04em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{cat.name}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Trending / Just For You */}
            <section style={{ padding: '40px 48px 60px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Star size={18} style={{ color: '#6366f1' }} />
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', fontFamily: "'Space Grotesk', sans-serif" }}>Just For You</h2>
                    </div>
                    <Link to="/search/all" style={{ fontSize: 12, color: '#6366f1', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        View All <ArrowRight size={14} />
                    </Link>
                </div>

                {status === 'loading' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
                        {[...Array(10)].map((_, i) => (
                            <div key={i} style={{ height: 300, background: 'rgba(15,14,23,0.7)', borderRadius: 16 }} className="skeleton" />
                        ))}
                    </div>
                ) : trendingProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: 16 }}>No products yet. Add products from the admin panel.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                        {trendingProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* Voice CTA Banner */}
            <section style={{ margin: '0 48px 60px', background: 'rgba(15, 14, 23, 0.6)', border: '1px solid rgba(99, 102, 241, 0.12)', borderRadius: 24, padding: '56px 48px', textAlign: 'center', backdropFilter: 'blur(12px)' }}>
                <p style={{ fontSize: 10, color: '#818cf8', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 18 }}>AI-Powered Shopping — Pakistan</p>
                <h2 style={{ fontFamily: "'Space Grotesk', serif", fontSize: 40, fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-0.02em' }}>
                    Just <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>say it.</span> We'll find it.
                </h2>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
                    Our AI understands Urdu and English. Try "iPhone 15 under 2 lakh" or "sasta laptop dhundo".
                </p>
                <button
                    onClick={() => dispatch(setStatus('listening'))}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', border: 'none', borderRadius: 12, padding: '16px 36px', fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em', boxShadow: '0 4px 14px rgba(99,102,241,0.25)', transition: 'all 0.25s' }}
                    className="hover:scale-[1.02] hover:brightness-110"
                >
                    <Mic size={18} /> Activate Voice Assistant
                </button>
            </section>
        </div>
    );
};

export default HomePage;
