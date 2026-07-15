import { useParams, Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Search as SearchIcon, ArrowLeft, Mic } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';

const SearchPage = () => {
    const { keyword } = useParams();
    const location = useLocation();
    const isVoiceResults = location.pathname === '/search/voice-results';

    // Read voice search results directly from Redux
    const { voiceSearchProducts, voiceSearchLabel } = useSelector(s => s.products);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const displayKeyword = isVoiceResults
        ? (voiceSearchLabel || 'Voice Search')
        : (keyword || 'All Products');

    useEffect(() => {
        if (isVoiceResults) {
            setProducts(voiceSearchProducts || []);
            setLoading(false);
            return;
        }
        if (!keyword) { setLoading(false); return; }

        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const { data } = await axios.get('/api/v1/products', { params: { keyword } });
                setProducts(data.products || []);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [keyword, isVoiceResults, voiceSearchProducts]);

    return (
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Header */}
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#818cf8', fontWeight: 700, fontSize: 13, textDecoration: 'none', marginBottom: 28, transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#818cf8'}>
                <ArrowLeft size={16} /> Back to Home
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                <div style={{ width: 48, height: 48, background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifycontent: 'center', justifyContent: 'center' }}>
                    {isVoiceResults
                        ? <Mic size={22} style={{ color: '#6366f1' }} />
                        : <SearchIcon size={22} style={{ color: '#6366f1' }} />}
                </div>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em', textTransform: 'uppercase', fontFamily: "'Space Grotesk', sans-serif" }}>
                        {isVoiceResults ? 'Voice Results' : `Results for "${displayKeyword}"`}
                    </h1>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
                        {loading ? 'Searching...' : `${products.length} product${products.length !== 1 ? 's' : ''} found${isVoiceResults && voiceSearchLabel ? ` for "${voiceSearchLabel}"` : ''}`}
                    </p>
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                    {[...Array(8)].map((_, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, aspectRatio: '3/4', animation: 'pulse 1.5s infinite' }} />
                    ))}
                </div>
            ) : error ? (
                <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 12, padding: 24, color: '#f43f5e', textAlign: 'center', fontWeight: 'bold' }}>
                    {error}
                </div>
            ) : products.length === 0 ? (
                <div style={{ background: 'rgba(15, 14, 23, 0.75)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 16, padding: '80px 24px', textAlign: 'center', backdropFilter: 'blur(12px)' }}>
                    <SearchIcon size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>No products found</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                        {isVoiceResults
                            ? `No results for "${displayKeyword}". Try saying something like "show me phones" or "laptops under 100000".`
                            : `No products found for "${displayKeyword}". Try a different search term.`}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchPage;
