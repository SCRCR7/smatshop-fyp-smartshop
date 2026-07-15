import React from 'react';
import { Lock, Eye, Mic, Shield, Bell, UserCheck } from 'lucide-react';

const Section = ({ icon: Icon, number, title, children }) => (
    <div style={{ display: 'flex', gap: 24, paddingBottom: 40, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ flexShrink: 0 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                <Icon size={20} />
            </div>
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: '#818cf8', fontWeight: 800, letterSpacing: '0.1em' }}>{number}</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
            </div>
            {children}
        </div>
    </div>
);

const Bullet = ({ text }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#6366f1', marginTop: 7, flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{text}</span>
    </div>
);

const PrivacyPage = () => {
    return (
        <div style={{ background: 'var(--brand-dark)', color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: '100vh' }}>
            <div style={{ maxWidth: 860, margin: '0 auto', padding: '60px 48px' }}>

                {/* Header */}
                <div style={{ marginBottom: 56 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                            <Lock size={22} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', fontFamily: "'Space Grotesk', sans-serif" }}>Privacy Policy</h1>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4, fontWeight: 700 }}>Last Updated: January 2026</p>
                        </div>
                    </div>
                    <div className="ss-card" style={{ padding: '16px 20px' }}>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            At SmartShop, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal data when you use our AI-powered voice commerce platform.
                        </p>
                    </div>
                </div>

                {/* Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

                    <Section icon={Eye} number="01" title="Data We Collect">
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>We collect information you provide when you create an account, place an order, or use our Voice AI:</p>
                        <Bullet text="Full name, email address, and phone number" />
                        <Bullet text="Shipping and billing addresses" />
                        <Bullet text="Voice commands (processed in real-time, not permanently stored)" />
                        <Bullet text="Order history and product preferences" />
                    </Section>

                    <Section icon={Bell} number="02" title="How We Use Your Data">
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>Your data is used solely to provide and improve your shopping experience:</p>
                        <Bullet text="Process and fulfill your orders accurately" />
                        <Bullet text="Improve voice recognition accuracy using anonymized data only" />
                        <Bullet text="Send order confirmations and shipping updates" />
                        <Bullet text="Detect and prevent fraudulent activity" />
                    </Section>

                    <Section icon={Mic} number="03" title="Voice Data Handling">
                        <div style={{ background: 'rgba(99, 102, 241, 0.04)', border: '1px solid rgba(99, 102, 241, 0.12)', borderRadius: 12, padding: '14px 18px', marginBottom: 16 }}>
                            <p style={{ fontSize: 13, color: '#fff', lineHeight: 1.7 }}>
                                Voice commands are processed in real-time for intent detection only. We do <strong style={{ color: '#818cf8' }}>not</strong> permanently store raw audio recordings on our servers.
                            </p>
                        </div>
                        <Bullet text="Audio is transmitted securely via HTTPS/TLS encryption" />
                        <Bullet text="Transcripts are anonymized before any analysis" />
                        <Bullet text="You can disable voice features at any time from your profile" />
                    </Section>

                    <Section icon={Shield} number="04" title="Data Security">
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>We implement industry-standard security measures to protect your information:</p>
                        <Bullet text="SSL/TLS encryption for all data in transit" />
                        <Bullet text="Passwords hashed with bcrypt — never stored in plain text" />
                        <Bullet text="Regular security audits and vulnerability assessments" />
                        <Bullet text="Strict access controls — only authorized personnel can access data" />
                    </Section>

                    <Section icon={UserCheck} number="05" title="Your Rights">
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>You have full control over your personal data:</p>
                        <Bullet text="Request a copy of all data we hold about you" />
                        <Bullet text="Request deletion of your account and all associated data" />
                        <Bullet text="Opt out of promotional communications at any time" />
                        <Bullet text="Update your information from your Profile page" />
                    </Section>

                </div>

                {/* Contact */}
                <div className="ss-card" style={{ marginTop: 48, padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Questions about your privacy?</h4>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Reach out to our data protection team</p>
                    </div>
                    <a href="mailto:privacy@smartshop.pk" style={{ background: '#6366f1', color: '#fff', textDecoration: 'none', padding: '10px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: '0 4px 12px rgba(99,102,241,0.2)', transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.filter = 'brightness(1.1)'} onMouseLeave={e => e.target.style.filter = 'none'}>
                        Contact Us
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
