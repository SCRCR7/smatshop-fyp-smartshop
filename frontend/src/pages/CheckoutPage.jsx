import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart, removeFromCart, selectCartTotal } from '../store/slices/cartSlice';
import { Lock, CreditCard, Banknote, Check, Loader2, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import PayButton from '../components/ui/PayButton';

const inputStyle = {
    width: '100%', height: 46, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: 12, padding: '0 16px', color: '#fff', fontSize: 13,
    outline: 'none', fontFamily: 'inherit', transition: 'all 0.2s ease'
};

const CardVisual = ({ cardNumber, cardName, expiry }) => (
    <div style={{
        background: 'linear-gradient(135deg, #141324 0%, #1c1a36 50%, #0d0c14 100%)',
        borderRadius: 16, padding: '24px 28px', color: '#fff', position: 'relative',
        overflow: 'hidden', marginBottom: 20, height: 160,
        border: '1px solid rgba(99, 102, 241, 0.12)'
    }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.04)' }} />
        <div style={{ position: 'absolute', bottom: -50, right: 30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.03)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', opacity: 0.9, letterSpacing: '-0.02em', fontFamily: "'Space Grotesk', sans-serif" }}>SmartShop</span>
            <div style={{ display: 'flex' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eb001b', opacity: 0.9 }} />
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f79e1b', opacity: 0.9, marginLeft: -14 }} />
            </div>
        </div>
        <p style={{ fontSize: 18, letterSpacing: '0.2em', fontFamily: 'monospace', color: '#fff', marginBottom: 16, opacity: cardNumber ? 1 : 0.4 }}>
            {cardNumber || '•••• •••• •••• ••••'}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Card Holder</p>
                <p style={{ fontSize: 13, color: '#fff', fontWeight: 600, opacity: cardName ? 1 : 0.4 }}>{cardName || 'YOUR NAME'}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Expires</p>
                <p style={{ fontSize: 13, color: '#fff', fontFamily: 'monospace', opacity: expiry ? 1 : 0.4 }}>{expiry || 'MM/YY'}</p>
            </div>
        </div>
    </div>
);

const CheckoutPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items } = useSelector(state => state.cart);
    const totalAmount = useSelector(selectCartTotal);
    const { user: userInfo } = useSelector(state => state.auth);

    const [guestInfo, setGuestInfo] = useState({ fullName: '', email: '', phone: '' });
    const [shippingAddress, setShippingAddress] = useState({ address: '', city: '', postalCode: '', country: 'Pakistan' });
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });
    const [cardData, setCardData] = useState({ 
        number: '4242 4242 4242 4242', 
        name: 'Stripe Test User', 
        expiry: '12/30', 
        cvv: '123' 
    });
    const [publishableKey, setPublishableKey] = useState('');

    React.useEffect(() => {
        const validateCart = async () => {
            if (items.length === 0) return;
            try {
                const ids = items.map(i => i._id).join(',');
                const { data } = await axios.get(`/api/v1/products?ids=${ids}&limit=200`);
                const validIds = new Set((data.products || data).map(p => p._id));
                items.forEach(item => {
                    if (!validIds.has(item._id)) {
                        console.warn(`[Cart] Removing stale product: ${item._id} (${item.title})`);
                        dispatch(removeFromCart({ id: item._id, variant: item.variant }));
                    }
                });
            } catch (err) {
                console.error('Cart validation error:', err);
            }
        };
        validateCart();
    }, []);

    React.useEffect(() => {
        const fetchStripeConfig = async () => {
            try {
                const { data } = await axios.get('/api/payment/config');
                if (data && data.publishableKey) {
                    setPublishableKey(data.publishableKey);
                }
            } catch (err) {
                console.error('Failed to load Stripe publishable key:', err);
            }
        };
        fetchStripeConfig();
    }, []);

    const SHIPPING_FEE = 199;
    const finalTotal = totalAmount + SHIPPING_FEE - discount;

    const formatCardNumber = (val) => {
        const v = val.replace(/\D/g, '').slice(0, 16);
        return v.replace(/(.{4})/g, '$1 ').trim();
    };
    const formatExpiry = (val) => {
        const v = val.replace(/\D/g, '').slice(0, 4);
        return v.length >= 3 ? `${v.slice(0, 2)}/${v.slice(2)}` : v;
    };

    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase() === 'VOICE10') {
            const discountAmount = Math.round(totalAmount * 0.10);
            setDiscount(discountAmount);
            setCouponMessage({ type: 'success', text: `Applied! Saved Rs. ${discountAmount.toLocaleString()}` });
        } else {
            setDiscount(0);
            setCouponMessage({ type: 'error', text: 'Invalid coupon code' });
        }
    };

    const handlePlaceOrder = () => {
        if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
            alert('Please fill in all shipping details.');
            return;
        }
        if (!userInfo && (!guestInfo.fullName || !guestInfo.email || !guestInfo.phone)) {
            alert('Please fill in all guest details.');
            return;
        }
        setIsProcessing(true);
        setTimeout(async () => {
            try {
                const orderData = {
                    orderItems: items.map(item => ({ product: item._id, name: item.title, image: item.images?.[0], price: item.price, qty: item.qty })),
                    shippingAddress, paymentMethod,
                    itemsPrice: totalAmount, shippingPrice: SHIPPING_FEE, totalAmount: finalTotal,
                };
                if (!userInfo) {
                    orderData.guestName = guestInfo.fullName;
                    orderData.guestEmail = guestInfo.email;
                    orderData.guestPhone = guestInfo.phone;
                    orderData.guestAddress = `${shippingAddress.address}, ${shippingAddress.city}`;
                }
                
                const { data } = await axios.post('/api/v1/orders', orderData);
                
                if (paymentMethod === 'Card') {
                    const stripeRes = await axios.post('/api/payment/create-checkout-session', { orderId: data.order._id });
                    if (stripeRes.data && stripeRes.data.url) {
                        dispatch(clearCart());
                        setIsProcessing(false);
                        window.location.href = stripeRes.data.url;
                        return;
                    } else {
                        throw new Error('Failed to retrieve checkout URL from Stripe');
                    }
                }
                
                dispatch(clearCart());
                setIsProcessing(false);
                navigate('/order-success');
            } catch (error) {
                console.error(error);
                setIsProcessing(false);
                const msg = error.response?.data?.message || 'Failed to place order. Please try again.';
                if (msg.includes('Product not found')) {
                    dispatch(clearCart());
                    alert('Some items in your cart are no longer available and have been removed. Please browse and re-add products.');
                    navigate('/');
                } else {
                    alert(msg);
                }
            }
        }, 2000);
    };

    if (items.length === 0) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-dark)', gap: 16 }}>
                <p style={{ fontSize: 18, color: 'var(--text-muted)', fontWeight: 700 }}>Your cart is empty</p>
                <button onClick={() => navigate('/')} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}>
                    Start Shopping
                </button>
            </div>
        );
    }

    const section = (num, title, children) => (
        <div className="ss-card p-6 mb-4">
            <h3 style={{ fontSize: 11, color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Space Grotesk', sans-serif" }}>
                <span style={{ width: 22, height: 22, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{num}</span>
                {title}
            </h3>
            {children}
        </div>
    );

    return (
        <div style={{ background: 'var(--brand-dark)', minHeight: '100vh', padding: '40px 24px 60px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left */}
                <div className="lg:col-span-8">
                    {!userInfo && section(0, 'Guest Checkout', (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {[{ key: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Your Name' }, { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@email.com' }, { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '03XXXXXXXXX' }].map(f => (
                                <div key={f.key}>
                                    <label style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 6, fontWeight: 700 }}>{f.label}</label>
                                    <input type={f.type} placeholder={f.placeholder} value={guestInfo[f.key]} onChange={e => setGuestInfo({ ...guestInfo, [f.key]: e.target.value })}
                                        style={inputStyle} onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 12px rgba(99,102,241,0.15)'; }} onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'; e.target.style.boxShadow = 'none'; }} />
                                </div>
                            ))}
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>Have an account? <span style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 700 }} onClick={() => navigate('/login')}>Login to checkout faster</span></p>
                        </div>
                    ))}

                    {section(1, 'Shipping Address', (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <label style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 6, fontWeight: 700 }}>Street Address</label>
                                <input placeholder="House / Apartment / Street" value={shippingAddress.address} onChange={e => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                    style={inputStyle} onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 12px rgba(99,102,241,0.15)'; }} onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'; e.target.style.boxShadow = 'none'; }} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 6, fontWeight: 700 }}>City</label>
                                    <input placeholder="Lahore" value={shippingAddress.city} onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                        style={inputStyle} onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 12px rgba(99,102,241,0.15)'; }} onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'; e.target.style.boxShadow = 'none'; }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 6, fontWeight: 700 }}>Postal Code</label>
                                    <input placeholder="54000" value={shippingAddress.postalCode} onChange={e => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                        style={inputStyle} onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 12px rgba(99,102,241,0.15)'; }} onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'; e.target.style.boxShadow = 'none'; }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 6, fontWeight: 700 }}>Country</label>
                                <input value="Pakistan" disabled style={{ ...inputStyle, color: 'var(--text-muted)', cursor: 'not-allowed', background: 'rgba(255, 255, 255, 0.01)' }} />
                            </div>
                        </div>
                    ))}

                    {section(2, 'Payment Method', (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {/* Mastercard */}
                            <label style={{
                                display: 'flex', flexDirection: 'column', gap: 0,
                                border: `1px solid ${paymentMethod === 'Card' ? '#6366f1' : 'rgba(255, 255, 255, 0.06)'}`,
                                borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                                background: paymentMethod === 'Card' ? 'rgba(99, 102, 241, 0.04)' : 'transparent', transition: 'all 0.2s'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <input type="radio" name="payment" checked={paymentMethod === 'Card'} onChange={() => setPaymentMethod('Card')} style={{ accentColor: '#6366f1' }} />
                                    <CreditCard size={16} style={{ color: '#6366f1' }} />
                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Credit / Debit Card</span>
                                    <div style={{ marginLeft: 'auto', display: 'flex', gap: -8 }}>
                                        <div style={{ width: 28, height: 20, borderRadius: 3, background: '#eb001b', opacity: 0.9 }} />
                                        <div style={{ width: 28, height: 20, borderRadius: 3, background: '#f79e1b', opacity: 0.9, marginLeft: -8 }} />
                                    </div>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>Mastercard</span>
                                </div>

                                {paymentMethod === 'Card' && (
                                    <div style={{ marginTop: 20 }}>
                                        <CardVisual
                                            cardNumber={cardData.number}
                                            cardName={cardData.name.toUpperCase()}
                                            expiry={cardData.expiry}
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                            <div>
                                                <label style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 6, fontWeight: 700 }}>Card Number</label>
                                                <input
                                                    placeholder="1234 5678 9012 3456"
                                                    value={cardData.number}
                                                    onChange={e => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                                                    style={{ ...inputStyle, fontFamily: 'monospace', letterSpacing: '0.1em' }}
                                                    onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 12px rgba(99,102,241,0.15)'; }}
                                                    onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'; e.target.style.boxShadow = 'none'; }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 6, fontWeight: 700 }}>Cardholder Name</label>
                                                <input
                                                    placeholder="Muhammad Nauman"
                                                    value={cardData.name}
                                                    onChange={e => setCardData({ ...cardData, name: e.target.value })}
                                                    style={inputStyle}
                                                    onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 12px rgba(99,102,241,0.15)'; }}
                                                    onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'; e.target.style.boxShadow = 'none'; }}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 6, fontWeight: 700 }}>Expiry Date</label>
                                                    <input
                                                        placeholder="MM/YY"
                                                        value={cardData.expiry}
                                                        onChange={e => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                                                        style={{ ...inputStyle, fontFamily: 'monospace' }}
                                                        onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 12px rgba(99,102,241,0.15)'; }}
                                                        onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'; e.target.style.boxShadow = 'none'; }}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 6, fontWeight: 700 }}>CVV</label>
                                                    <input
                                                        placeholder="•••"
                                                        type="password"
                                                        maxLength={3}
                                                        value={cardData.cvv}
                                                        onChange={e => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                                                        style={{ ...inputStyle, fontFamily: 'monospace' }}
                                                        onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 12px rgba(99,102,241,0.15)'; }}
                                                        onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'; e.target.style.boxShadow = 'none'; }}
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 12px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: 10, border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                                                <ShieldCheck size={14} style={{ color: '#818cf8', flexShrink: 0 }} />
                                                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Stripe Test Mode. You will redirect to secure Stripe hosted checkout (Test Card: 4242 4242 4242 4242).</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </label>

                            {/* COD */}
                            <label style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                border: `1px solid ${paymentMethod === 'COD' ? '#6366f1' : 'rgba(255, 255, 255, 0.06)'}`,
                                borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                                background: paymentMethod === 'COD' ? 'rgba(99, 102, 241, 0.04)' : 'transparent', transition: 'all 0.2s'
                            }}>
                                <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} style={{ accentColor: '#6366f1' }} />
                                <Banknote size={16} style={{ color: paymentMethod === 'COD' ? '#6366f1' : 'var(--text-muted)' }} />
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Cash on Delivery</p>
                                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontWeight: 600 }}>Pay with cash when your order arrives</p>
                                </div>
                            </label>
                        </div>
                    ))}
                </div>

                {/* Right - Order Summary */}
                <div className="lg:col-span-4">
                    <div className="ss-card p-6 sticky top-24" style={{ borderTop: '4px solid #6366f1' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 20, fontFamily: "'Space Grotesk', sans-serif" }}>Order Summary</h3>

                        {/* Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20, maxHeight: 220, overflowY: 'auto' }}>
                            {items.map(item => (
                                <div key={item._id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <ImageWithFallback src={item.images?.[0]} alt={item.title} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 12, color: '#fff', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                                        <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Qty: {item.qty}</p>
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981', flexShrink: 0 }}>Rs. {(item.price * item.qty).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        {/* Coupon */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 8, fontWeight: 700 }}>Voucher Code</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input
                                    placeholder="VOICE10"
                                    value={couponCode}
                                    onChange={e => setCouponCode(e.target.value)}
                                    style={{ flex: 1, height: 40, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 10, padding: '0 12px', color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'monospace', letterSpacing: '0.08em' }}
                                />
                                <button onClick={handleApplyCoupon} style={{ height: 40, padding: '0 16px', background: 'rgba(255, 255, 255, 0.04)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>Apply</button>
                            </div>
                            {couponMessage.text && (
                                <p style={{ fontSize: 12, marginTop: 8, color: couponMessage.type === 'success' ? '#10b981' : '#f43f5e', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 'bold' }}>
                                    {couponMessage.type === 'success' && <Check size={12} />}
                                    {couponMessage.text}
                                </p>
                            )}
                        </div>

                        {/* Totals */}
                        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                { label: 'Subtotal', val: `Rs. ${totalAmount.toLocaleString()}` },
                                { label: 'Shipping', val: `Rs. ${SHIPPING_FEE}` },
                                ...(discount > 0 ? [{ label: 'Discount', val: `-Rs. ${discount.toLocaleString()}`, indigo: true }] : []),
                            ].map(row => (
                                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
                                    <span>{row.label}</span>
                                    <span style={{ color: row.indigo ? '#818cf8' : '#fff', fontWeight: row.indigo ? 700 : 600 }}>{row.val}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: 12, marginTop: 4 }}>
                                <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Total</span>
                                <span style={{ fontSize: 18, fontWeight: 700, color: '#10b981' }}>Rs. {finalTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <PayButton
                            onClick={handlePlaceOrder}
                            loading={isProcessing}
                            buttonText={paymentMethod === 'Card' ? "Pay with Card (Stripe)" : "Place Order"}
                        />

                        <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontWeight: 700 }}>
                            <ShieldCheck size={12} className="text-[#10b981]" /> SSL Encrypted & Secure Checkout
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
