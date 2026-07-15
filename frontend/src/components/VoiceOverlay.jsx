import React, { useEffect, useRef } from 'react';
import { Mic, X, Loader2, Volume2, ShoppingCart, Navigation, Search } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setStatus, setTranscript, analyzeVoice, resetAssistant } from '../store/slices/productSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';

const COMMANDS = {
    en: [
        { icon: '🔍', text: '"Show Nike shoes"' },
        { icon: '💰', text: '"Laptops under 80,000"' },
        { icon: '🛒', text: '"Add Sony headphones to cart"' },
        { icon: '📍', text: '"Go to checkout"' },
        { icon: '📱', text: '"Open electronics"' },
        { icon: '👤', text: '"My orders"' },
        { icon: '❤️', text: '"Show beauty products"' },
        { icon: '🏠', text: '"Go to home"' },
    ],
    // Roman Urdu — Chrome en-US mic can recognize these perfectly
    ur: [
        { icon: '🔍', text: '"Joote dikhao"' },
        { icon: '💰', text: '"80000 se kam laptop"' },
        { icon: '🛒', text: '"Headphones cart mein dalo"' },
        { icon: '📍', text: '"Checkout par jao"' },
        { icon: '📱', text: '"Electronics kholo"' },
        { icon: '🏠', text: '"Ghar jao"' },
        { icon: '💄', text: '"Beauty products dikhao"' },
        { icon: '👟', text: '"Saste joote dikhao"' },
    ],
};

const VoiceOverlay = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { status, assistantMessage, voiceResult } = useSelector(s => s.products);
    const [transcript, setLocalTranscript] = React.useState('');
    const [cmdIdx, setCmdIdx] = React.useState(0);
    const [lang, setLang] = React.useState('en'); // 'en' | 'ur'

    const recRef = useRef(null);
    const silenceRef = useRef(null);
    const transcriptRef = useRef('');
    const statusRef = useRef(status);
    const langRef = useRef(lang);

    const isVisible = ['listening', 'processing', 'succeeded', 'failed'].includes(status);
    const isListening = status === 'listening';
    const isProcessing = status === 'processing';
    const isDone = status === 'succeeded';
    const isFailed = status === 'failed';
    const isUrdu = lang === 'ur';
    const cmds = COMMANDS[lang];

    useEffect(() => { langRef.current = lang; }, [lang]);

    // Rotate example commands
    useEffect(() => {
        if (!isListening) return;
        const t = setInterval(() => setCmdIdx(i => (i + 1) % cmds.length), 2500);
        return () => clearInterval(t);
    }, [isListening, lang]);

    // TTS — speak in Urdu or English based on current lang
    useEffect(() => {
        if (!assistantMessage) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(assistantMessage);
        u.lang = 'en-US'; // Always en-US — Windows has no ur-PK TTS voice; Roman Urdu is spoken by English voice
        u.rate = 0.92;
        u.pitch = 1;
        window.speechSynthesis.speak(u);
    }, [assistantMessage]);

    // Handle voice result actions
    useEffect(() => {
        if (!voiceResult || status !== 'succeeded') return;

        if ((voiceResult.intent === 'NAVIGATE' || voiceResult.intent === 'ORDER') && voiceResult.redirect) {
            const path = voiceResult.redirect;
            dispatch(resetAssistant());
            setTimeout(() => navigate(path), 50);
            return;
        }
        if (voiceResult.intent === 'CART_ACTION' && voiceResult.cartProduct) {
            dispatch(addToCart({ product: voiceResult.cartProduct, quantity: voiceResult.cartQty || 1 }));
            setTimeout(() => dispatch(resetAssistant()), 2000);
            return;
        }
        if (voiceResult.intent === 'WISHLIST_ACTION' && voiceResult.cartProduct) {
            dispatch(toggleWishlist(voiceResult.cartProduct));
            setTimeout(() => dispatch(resetAssistant()), 2000);
            return;
        }
        if (voiceResult.intent === 'SEARCH') {
            dispatch(resetAssistant());
            setTimeout(() => navigate('/search/voice-results'), 50);
        }
    }, [voiceResult, status]);

    const stopRec = () => {
        if (silenceRef.current) clearTimeout(silenceRef.current);
        try { recRef.current?.stop(); } catch (_) {}
    };

    const submit = (text) => {
        const t = (text || transcriptRef.current || '').trim();
        if (!t) return;
        stopRec();
        dispatch(analyzeVoice({ text: t, currentPath: location.pathname, lang: langRef.current }));
    };

    const startRec = () => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { alert('Please use Google Chrome for voice features.'); return; }
        try { recRef.current?.stop(); } catch (_) {}

        transcriptRef.current = '';
        setLocalTranscript('');

        const rec = new SR();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US'; // Always en-US — Chrome reliably supports it; Urdu mode = Roman Urdu
        rec.maxAlternatives = 1;
        recRef.current = rec;

        rec.onresult = (e) => {
            let interim = '', finalText = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
                else interim += e.results[i][0].transcript;
            }
            const current = transcriptRef.current + finalText;
            if (finalText) transcriptRef.current = current;
            const display = current + interim;
            setLocalTranscript(display);
            dispatch(setTranscript(display));
            if (finalText) {
                if (silenceRef.current) clearTimeout(silenceRef.current);
                silenceRef.current = setTimeout(() => submit(current), 600);
            }
        };

        rec.onerror = (e) => {
            if (e.error === 'no-speech') return;
            if (e.error !== 'aborted') dispatch(setStatus('failed'));
        };

        rec.onend = () => {
            if (statusRef.current === 'listening') {
                try { rec.start(); } catch (_) { setTimeout(startRec, 200); }
            }
        };

        try { rec.start(); } catch (_) { setTimeout(startRec, 300); }
    };

    useEffect(() => { statusRef.current = status; }, [status]);

    useEffect(() => {
        if (status === 'succeeded') {
            const t = setTimeout(() => dispatch(resetAssistant()), 1500);
            return () => clearTimeout(t);
        }
    }, [status]);

    useEffect(() => {
        if (status === 'listening') {
            setLocalTranscript('');
            transcriptRef.current = '';
            startRec();
        }
        if (status === 'idle') stopRec();
    }, [status]);

    // No mic restart on lang change — lang only affects UI and backend interpretation

    useEffect(() => () => stopRec(), []);

    const handleClose = () => { stopRec(); dispatch(resetAssistant()); };
    const handleRetry = () => { stopRec(); dispatch(resetAssistant()); setTimeout(() => dispatch(setStatus('listening')), 100); };

    const switchLang = () => {
        const next = lang === 'en' ? 'ur' : 'en';
        setLang(next);
        setCmdIdx(0);
    };

    if (!isVisible) return null;

    const intentIcon = voiceResult?.intent === 'NAVIGATE' ? <Navigation size={18} style={{ color: '#6366f1' }} />
        : voiceResult?.intent === 'CART_ACTION' ? <ShoppingCart size={18} style={{ color: '#10b981' }} />
        : voiceResult?.intent === 'SEARCH' ? <Search size={18} style={{ color: '#818cf8' }} />
        : null;

    return (
        <div onClick={e => { if (e.target === e.currentTarget) handleClose(); }} style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(7, 7, 12, 0.95)', backdropFilter: 'blur(28px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
            {/* Close */}
            <button onClick={handleClose} style={{ position: 'absolute', top: 24, right: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: 44, height: 44, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'}>
                <X size={18} />
            </button>

            {/* Page context badge */}
            <div style={{ position: 'absolute', top: 24, left: 24, background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 20, padding: '4px 14px', fontSize: 10, color: '#818cf8', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                📍 {location.pathname === '/' ? 'Home' : location.pathname.replace('/', '').replace('category/', '').replace('-', ' ')}
            </div>

            {/* Language toggle — top center */}
            <div style={{ position: 'absolute', top: 24, display: 'flex', alignItems: 'center', gap: 0, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setLang('en')} style={{
                    padding: '8px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none',
                    background: lang === 'en' ? '#6366f1' : 'transparent',
                    color: lang === 'en' ? '#fff' : '#64748b',
                    letterSpacing: '0.06em', transition: 'all 0.2s',
                }}>🇬🇧 EN</button>
                <button onClick={() => setLang('ur')} style={{
                    padding: '8px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none',
                    background: lang === 'ur' ? '#6366f1' : 'transparent',
                    color: lang === 'ur' ? '#fff' : '#64748b',
                    letterSpacing: '0.06em', transition: 'all 0.2s',
                }}>🇵🇰 اردو</button>
            </div>

            {/* Status */}
            <p style={{ fontSize: 11, color: isListening ? '#6366f1' : isProcessing ? '#818cf8' : isDone ? '#10b981' : '#f43f5e', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 28 }}>
                {isListening ? (isUrdu ? '● سن رہا ہوں' : '● Listening')
                    : isProcessing ? (isUrdu ? '◌ سمجھ رہا ہوں' : '◌ Processing')
                    : isDone ? (isUrdu ? '✓ سمجھ گیا!' : '✓ Got it!')
                    : (isUrdu ? '✗ غلطی ہوئی' : '✗ Error')}
            </p>

            {/* Mic */}
            <div style={{ position: 'relative', marginBottom: 36 }}>
                {isListening && (
                    <>
                        <div style={{ position: 'absolute', inset: -16, borderRadius: '50%', border: '1px solid rgba(99, 102, 241, 0.4)', animation: 'ping 1.4s ease-out infinite' }} />
                        <div style={{ position: 'absolute', inset: -32, borderRadius: '50%', border: '1px solid rgba(99, 102, 241, 0.2)', animation: 'ping 1.4s ease-out 0.35s infinite' }} />
                        <div style={{ position: 'absolute', inset: -48, borderRadius: '50%', border: '1px solid rgba(99, 102, 241, 0.1)', animation: 'ping 1.4s ease-out 0.7s infinite' }} />
                    </>
                )}
                <button onClick={() => isListening ? submit(transcriptRef.current) : handleRetry()} style={{
                    width: 100, height: 100, borderRadius: '50%', border: 'none', cursor: 'pointer',
                    background: isListening ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : isProcessing ? '#141324' : isDone ? '#059669' : '#b91c1c',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: isListening ? '0 0 80px rgba(99, 102, 241, 0.4)' : 'none', transition: 'all 0.3s',
                }}>
                    {isProcessing ? <Loader2 size={40} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Mic size={40} fill={isListening ? '#fff' : 'none'} />}
                </button>
            </div>

            {/* Language indicator under mic */}
            <div style={{ marginBottom: 16, fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.05em', textAlign: 'center' }}>
                {isUrdu
                    ? <span>Roman Urdu mein bolein <span style={{ color: '#6366f1' }}>•</span> جیسے: "ghar jao" یا "joote dikhao"</span>
                    : 'Speak clearly in English'}
            </div>

            {/* Main text */}
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16, textAlign: 'center', direction: isUrdu ? 'rtl' : 'ltr', fontFamily: "'Space Grotesk', sans-serif" }}>
                {isListening ? (isUrdu ? 'اپنا حکم بولیں' : 'Say your command')
                    : isProcessing ? (isUrdu ? 'سمجھ رہا ہوں...' : 'Understanding...')
                    : isDone ? (isUrdu ? 'سمجھ گیا!' : 'Got it!')
                    : (isUrdu ? 'کچھ غلط ہوا' : 'Something went wrong')}
            </h2>

            {/* Transcript */}
            {transcript && (
                <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 12, padding: '10px 20px', marginBottom: 14, maxWidth: 480, textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                    <p style={{ fontSize: 15, color: '#fff', fontStyle: 'italic', direction: isUrdu ? 'rtl' : 'ltr' }}>"{transcript}"</p>
                </div>
            )}

            {/* Submit button */}
            {isListening && transcript && (
                <button onClick={() => submit(transcriptRef.current)} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 26px', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 14, boxShadow: '0 4px 10px rgba(99,102,241,0.2)' }}>
                    {isUrdu ? 'بھیجیں ↵' : 'Submit ↵'}
                </button>
            )}

            {/* AI response */}
            {assistantMessage && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 20px', marginBottom: 14, maxWidth: 480 }}>
                    {intentIcon}
                    <Volume2 size={16} style={{ color: '#6366f1', flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, direction: isUrdu ? 'rtl' : 'ltr' }}>{assistantMessage}</p>
                </div>
            )}

            {/* Error */}
            {isFailed && (
                <div style={{ marginBottom: 14, textAlign: 'center' }}>
                    <p style={{ fontSize: 12, color: '#f43f5e' }}>
                        {isUrdu ? 'غلطی ہوئی۔ سرور چل رہا ہے؟' : 'Backend error. Make sure the server is running on port 5000.'}
                    </p>
                    <button onClick={handleRetry} style={{ marginTop: 10, background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                        {isUrdu ? 'دوبارہ کوشش کریں' : 'Try Again'}
                    </button>
                </div>
            )}

            {/* Rotating examples */}
            {isListening && !transcript && (
                <div style={{ marginTop: 28, textAlign: 'center' }}>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 14, fontWeight: 700 }}>
                        {isUrdu ? 'مثال کے طور پر' : 'Try saying'}
                    </p>
                    <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.15)', borderRadius: 12, padding: '10px 24px', display: 'inline-block', direction: isUrdu ? 'rtl' : 'ltr' }}>
                        <span style={{ fontSize: 16, marginRight: 8 }}>{cmds[cmdIdx % cmds.length].icon}</span>
                        <span style={{ fontSize: 13, color: '#cbd5e1', fontStyle: 'italic' }}>{cmds[cmdIdx % cmds.length].text}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 20, maxWidth: 520 }}>
                        {cmds.map((c, i) => (
                            <span key={i} style={{ fontSize: 10, color: i === cmdIdx % cmds.length ? '#fff' : '#64748b', background: i === cmdIdx % cmds.length ? '#6366f1' : 'rgba(255,255,255,0.02)', border: `1px solid ${i === cmdIdx % cmds.length ? '#6366f1' : 'rgba(255,255,255,0.05)'}`, borderRadius: 16, padding: '4px 12px', direction: isUrdu ? 'rtl' : 'ltr', cursor: 'pointer', transition: 'all 0.2s' }}>
                                {c.icon} {c.text.replace(/"/g, '')}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <p style={{ position: 'absolute', bottom: 24, fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.15em', fontWeight: 700 }}>
                SMARTSHOP AI VOICE ASSISTANT
            </p>
        </div>
    );
};

export default VoiceOverlay;
