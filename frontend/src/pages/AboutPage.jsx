import React from 'react';
import { Mic, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';

const AboutPage = () => {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--brand-dark)', color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Hero */}
            <section style={{ textAlign: 'center', padding: '100px 48px 80px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', position: 'relative' }}>
                <div style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 60%)', position: 'absolute', inset: 0, zIndex: 0 }} />
                <span style={{ fontSize: 11, color: '#818cf8', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', position: 'relative', zIndex: 1 }}>About Us</span>
                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 56, fontWeight: 800, color: '#fff', margin: '20px 0 24px', letterSpacing: '-0.02em', lineHeight: 1.1, position: 'relative', zIndex: 1 }}>
                    We Are <span style={{ color: '#6366f1', background: 'linear-gradient(135deg, #818cf8, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SmartShop</span>
                </h1>
                <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.8, position: 'relative', zIndex: 1 }}>
                    Pakistan's first AI-powered voice commerce platform. Redefining how you shop by blending state-of-the-art AI with the warmth of local language.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
                    <span style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 20, padding: '6px 18px', fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Est. 2026</span>
                    <span style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 20, padding: '6px 18px', fontSize: 11, color: '#818cf8', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Peshawar, PK</span>
                </div>
            </section>

            {/* Mission Grid */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 1, background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                {[
                    { icon: Mic, title: 'Voice First', desc: 'Just speak. Our advanced voice AI understands Urdu, English, and Roman Urdu instantly.' },
                    { icon: ShoppingBag, title: 'Curated Mall', desc: 'From fashion to electronics, thousands of authentic products from trusted brands.' },
                    { icon: ShieldCheck, title: 'Secure & Trusted', desc: 'End-to-end encryption and rigorous seller vetting ensure your complete peace of mind.' },
                    { icon: Truck, title: 'Fast Delivery', desc: 'Nationwide delivery network — orders reach you within 3–5 working days.' },
                ].map((item, i) => (
                    <div key={i} style={{ background: '#09080f', padding: '48px 32px', textAlign: 'center' }}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#6366f1', boxShadow: '0 0 16px rgba(99, 102, 241, 0.15)' }}>
                            <item.icon size={28} />
                        </div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12, fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{item.desc}</p>
                    </div>
                ))}
            </section>

            {/* Story */}
            <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 80, alignItems: 'center' }}>
                <div>
                    <span style={{ fontSize: 11, color: '#818cf8', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Our Story</span>
                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 800, color: '#fff', margin: '16px 0 24px', lineHeight: 1.2 }}>The Future is <span style={{ color: '#6366f1' }}>Spoken</span></h2>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: 16 }}>
                        Shopping online used to mean endless clicking and scrolling. We asked: why can't you just ask for what you want?
                    </p>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.9 }}>
                        SmartShop was born from a desire to make technology invisible. With cutting-edge voice AI, we've built a platform that listens, understands, and delivers — whether you're looking for a bridal dress or a gaming laptop, your voice is the only tool you need.
                    </p>
                </div>
                <div className="ss-card" style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {[
                        { num: '28+', label: 'Products Available' },
                        { num: '6', label: 'Categories' },
                        { num: '100%', label: 'Voice Enabled' },
                        { num: '2026', label: 'Founded in Peshawar' },
                    ].map(s => (
                        <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</span>
                            <span style={{ fontSize: 28, fontWeight: 800, color: '#10b981', fontFamily: "'Space Grotesk', sans-serif" }}>{s.num}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
