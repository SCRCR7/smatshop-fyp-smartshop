import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { ArrowLeft, Lock, Mail, ChevronRight } from 'lucide-react';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector(state => state.auth);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isAdminLogin, setIsAdminLogin] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            const { data } = await axios.post('/api/v1/auth/login', formData);
            if (isAdminLogin && data.user.role !== 'admin') {
                dispatch(loginFailure('This account does not have admin privileges.'));
                return;
            }
            dispatch(loginSuccess({ user: data.user, token: data.token }));
            navigate(data.user.role === 'admin' ? '/admin' : '/');
        } catch (err) {
            dispatch(loginFailure(err.response?.data?.message || 'Invalid email or password.'));
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        dispatch(loginStart());
        try {
            const { data } = await axios.post('/api/v1/auth/google', { credential: credentialResponse.credential });
            dispatch(loginSuccess({ user: data.user, token: data.token }));
            navigate('/');
        } catch (err) {
            dispatch(loginFailure('Google sign-in failed. Please try again.'));
        }
    };

    const inputStyle = {
        width: '100%', height: 48, background: 'rgba(15, 14, 23, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 10, padding: '0 16px 0 44px', color: '#fff', fontSize: 14,
        outline: 'none', transition: 'all 0.25s ease', fontFamily: 'inherit'
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--brand-dark)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Left branding */}
            <div style={{ display: 'none', flex: 1, background: 'radial-gradient(circle at 10% 10%, rgba(99,102,241,0.06) 0%, transparent 60%), #07070c', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '48px', flexDirection: 'column', justifyContent: 'space-between' }}
                className="lg-flex">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', fontFamily: "'Space Grotesk', sans-serif" }}>Smart<span style={{ color: '#6366f1', background: 'linear-gradient(135deg, #818cf8, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Shop</span></span>
                </Link>
                <div>
                    <p style={{ fontSize: 10, color: '#818cf8', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>
                        AI-Powered Shopping
                    </p>
                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 56, fontWeight: 800, color: '#fff', lineHeight: 1.08, letterSpacing: '-0.03em' }}>
                        The future<br />is <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Voice.</span>
                    </h2>
                    <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 20, lineHeight: 1.7, maxWidth: 360 }}>
                        Shop and discover amazing products with Pakistan's smartest conversational AI assistant.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 20 }}>
                    {[{ val: '2.5M+', label: 'Users' }, { val: '99.8%', label: 'Satisfaction' }].map(s => (
                        <div key={s.label} style={{ background: 'rgba(15, 14, 23, 0.6)', border: '1px solid rgba(99, 102, 241, 0.12)', borderRadius: 12, padding: '16px 20px', backdropFilter: 'blur(10px)' }}>
                            <p style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>{s.val}</p>
                            <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4, fontWeight: 700 }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right form */}
            <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 40px', position: 'relative' }}>
                <Link to="/" style={{ position: 'absolute', top: 24, left: 24, color: '#64748b', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
                    <ArrowLeft size={20} />
                </Link>

                <div style={{ marginBottom: 36 }}>
                    <Link to="/" style={{ textDecoration: 'none', display: 'block', marginBottom: 32 }}>
                        <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', fontFamily: "'Space Grotesk', sans-serif" }}>Smart<span style={{ color: '#6366f1', background: 'linear-gradient(135deg, #818cf8, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Shop</span></span>
                    </Link>
                    <h1 style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>
                        {isAdminLogin ? 'Admin Access' : 'Welcome back'}
                    </h1>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        {isAdminLogin ? 'Secure administration portal' : 'Sign in to your account'}
                    </p>
                </div>

                {/* Google Sign In */}
                {!isAdminLogin && (
                    <div style={{ marginBottom: 24 }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => dispatch(loginFailure('Google sign-in failed.'))}
                            theme="filled_black"
                            size="large"
                            width="400"
                            text="signin_with"
                            shape="rectangular"
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                            <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.06)' }} />
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>or</span>
                            <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.06)' }} />
                        </div>
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                            type="email" required
                            placeholder="Email address"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            style={inputStyle}
                            onFocus={e => {
                                e.target.style.borderColor = '#6366f1';
                                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
                                e.target.style.background = 'rgba(20, 19, 31, 0.95)';
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                e.target.style.boxShadow = 'none';
                                e.target.style.background = 'rgba(15, 14, 23, 0.8)';
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                            type="password" required
                            placeholder="Password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            style={inputStyle}
                            onFocus={e => {
                                e.target.style.borderColor = '#6366f1';
                                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
                                e.target.style.background = 'rgba(20, 19, 31, 0.95)';
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                e.target.style.boxShadow = 'none';
                                e.target.style.background = 'rgba(15, 14, 23, 0.8)';
                            }}
                        />
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#f43f5e' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ height: 48, background: loading ? '#221f35' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.25s', letterSpacing: '0.02em', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.filter = 'brightness(1.1)'; }}
                        onMouseLeave={e => { if (!loading) e.currentTarget.style.filter = 'none'; }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                        {!loading && <ChevronRight size={16} />}
                    </button>
                </form>

                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <button
                        onClick={() => setIsAdminLogin(!isAdminLogin)}
                        style={{ height: 44, background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600 }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#6366f1';
                            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        {isAdminLogin ? '← Back to User Login' : '→ Admin Login'}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 700 }}>Create account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
