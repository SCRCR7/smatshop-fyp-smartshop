import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist, selectIsInWishlist } from '../../store/slices/wishlistSlice';
import ImageWithFallback from './ImageWithFallback';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const isInWishlist = useSelector(state => selectIsInWishlist(state, product._id));
    const [imgLoaded, setImgLoaded] = useState(false);
    const [hovered, setHovered] = useState(false);

    const discountPercent = product.discount || 0;
    const originalPrice = discountPercent > 0 ? Math.round(product.price * (1 + discountPercent / 100)) : null;
    const rating = product.rating || 4.5;

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: 'rgba(15, 14, 23, 0.75)',
                border: `1px solid ${hovered ? 'rgba(99, 102, 241, 0.28)' : 'rgba(99, 102, 241, 0.12)'}`,
                borderRadius: 16,
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hovered ? 'translateY(-4px)' : 'none',
                boxShadow: hovered ? '0 10px 30px rgba(99, 102, 241, 0.08)' : '0 4px 20px rgba(0, 0, 0, 0.25)',
                position: 'relative',
                backdropFilter: 'blur(12px)',
            }}
        >
            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', display: 'block' }}>
                {/* Image */}
                <div style={{ position: 'relative', aspectRatio: '1', background: '#09080f', overflow: 'hidden' }}>
                    {!imgLoaded && <div style={{ position: 'absolute', inset: 0 }} className="skeleton" />}
                    <ImageWithFallback
                        src={product.images?.[0] || ''}
                        alt={product.title}
                        onLoad={() => setImgLoaded(true)}
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            opacity: imgLoaded ? 1 : 0,
                            transition: 'transform 0.4s ease, opacity 0.3s ease',
                            transform: hovered ? 'scale(1.05)' : 'scale(1)',
                        }}
                    />
                    {/* Discount badge — only shown when product has a real discount */}
                    {discountPercent > 0 && (
                        <div style={{
                            position: 'absolute', top: 10, left: 10,
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', fontSize: 10, fontWeight: 800,
                            padding: '4px 9px', borderRadius: 6, letterSpacing: '0.04em',
                            boxShadow: '0 2px 6px rgba(16,185,129,0.25)'
                        }}>
                            -{discountPercent}%
                        </div>
                    )}
                </div>

                {/* Info */}
                <div style={{ padding: '16px 16px 12px' }}>
                    <p style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 6 }}>
                        {product.category || 'Product'}
                    </p>
                    <h3 style={{ fontSize: 14, color: '#f8fafc', lineHeight: 1.4, fontWeight: 600, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 40, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {product.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
                        <span style={{ fontSize: 17, fontWeight: 700, color: '#10b981', fontFamily: "'Space Grotesk', sans-serif" }}>Rs. {product.price?.toLocaleString()}</span>
                        {originalPrice && (
                            <span style={{ fontSize: 11, color: '#64748b', textDecoration: 'line-through' }}>Rs. {originalPrice.toLocaleString()}</span>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={11} fill="#f59e0b" color="#f59e0b" />
                        <span style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 600 }}>{Number(rating).toFixed(1)}</span>
                        <span style={{ fontSize: 11, color: '#64748b', marginLeft: 2 }}>({product.numReviews || 0})</span>
                    </div>
                </div>
            </Link>

            {/* Action buttons - appear on hover */}
            <div style={{
                position: 'absolute', bottom: 16, right: 16,
                display: 'flex', gap: 6,
                opacity: hovered ? 1 : 0,
                transform: hovered ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
                <button
                    onClick={(e) => { e.preventDefault(); dispatch(toggleWishlist(product)); }}
                    style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: isInWishlist ? 'rgba(244,63,94,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isInWishlist ? 'rgba(244,63,94,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        color: isInWishlist ? '#f43f5e' : '#cbd5e1',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                        if (!isInWishlist) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                >
                    <Heart size={14} fill={isInWishlist ? '#f43f5e' : 'none'} />
                </button>
                <button
                    onClick={(e) => { e.preventDefault(); dispatch(addToCart({ product, quantity: 1 })); }}
                    style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: 'none', color: '#fff',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(99, 102, 241, 0.35)',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                >
                    <ShoppingCart size={14} />
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
