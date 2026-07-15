import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { ArrowLeft, User, Mail, Lock, ChevronRight } from 'lucide-react';

const SignupPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector(state => state.auth);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [localError, setLocalError] = useState(null);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLocalError(null);
        if (formData.password !== formData.confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }
        dispatch(loginStart());
        try {
            const { data } = await axios.post('/api/v1/auth/register', {
                name: formData.name, email: formData.email, password: formData.password
            });
            dispatch(loginSuccess({ user: data.user, token: data.token }));
            navigate('/');
        } catch (err) {
            dispatch(loginFailure(err.response?.data?.message || 'Registration failed.'));
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        dispatch(loginStart());
        try {
            const { data } = await axios.post('/api/v1/auth/google', { credential: credentialResponse.credential });
            dispatch(loginSuccess({ user: data.user, token: data.token }));
            navigate('/');
        } catch (err) {
            dispatch(loginFailure('Google sign-up failed. Please try again.'));
        }
    };

    const inputStyle = {
        width: '100%', height: 50, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: 12, padding: '0 16px 0 44px', color: '#fff', fontSize: 14,
        outline: 'none', transition: 'all 0.2s ease', fontFamily: 'inherit'
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-dark)', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '40px 20px', position: 'relative' }}>
            {/* Background Glow */}
            <div style={{ background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 60%)', position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }} className="ss-card p-8 sm:p-10">
                <Link to="/" style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', textDecoration: 'none', gap: 6, fontSize: 13, marginBottom: 24, fontWeight: 700, transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
                    <ArrowLeft size={16} /> Back to Store
                </Link>

                <div style={{ display: 'block', marginBottom: 28 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>
                        Smart<span style={{ color: '#6366f1', background: 'linear-gradient(135deg, #818cf8, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Shop</span>
                    </span>
                </div>

                <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>Create account</h1>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28, fontWeight: 600 }}>Join millions of shoppers on SmartShop</p>

                {/* Google Sign Up */}
                <div style={{ marginBottom: 24 }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => dispatch(loginFailure('Google sign-up failed.'))}
                        theme="filled_black"
                        size="large"
                        width="460"
                        text="signup_with"
                        shape="circle"
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.05)' }} />
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>or sign up with email</span>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.05)' }} />
                    </div>
                </div>

                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ position: 'relative' }}>
                        <User size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text" required placeholder="Full name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            style={inputStyle}
                            onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 16px rgba(99, 102, 241, 0.15)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Mail size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="email" required placeholder="Email address"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            style={inputStyle}
                            onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 16px rgba(99, 102, 241, 0.15)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password" required placeholder="Password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                style={inputStyle}
                                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 16px rgba(99, 102, 241, 0.15)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password" required placeholder="Confirm"
                                value={formData.confirmPassword}
                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                style={inputStyle}
                                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 16px rgba(99, 102, 241, 0.15)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                    </div>

                    {(error || localError) && (
                        <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#f43f5e', fontWeight: 'bold' }}>
                            {error || localError}
                        </div>
                    )}

                    <button
                        type="submit" disabled={loading}
                        style={{ height: 50, background: loading ? 'rgba(255, 255, 255, 0.04)' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4, transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 14px rgba(99, 102, 241, 0.25)' }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.filter = 'brightness(1.1)'; }}
                        onMouseLeave={e => { if (!loading) e.currentTarget.style.filter = 'none'; }}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                        {!loading && <ChevronRight size={16} />}
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', marginTop: 24, fontWeight: 500 }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 700 }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
