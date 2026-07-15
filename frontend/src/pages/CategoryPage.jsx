import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Package, ArrowLeft, Loader2 } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';

const CategoryPage = () => {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`/api/v1/products/category/${slug}`);
                setProducts(data.products);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch products');
                setLoading(false);
            }
        };

        if (slug) {
            fetchProducts();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="bg-white/[0.01] border border-white/5 aspect-[3/4] rounded-2xl animate-pulse p-4 space-y-4 shadow-sm">
                            <div className="bg-white/5 w-full aspect-square rounded-xl" />
                            <div className="bg-white/5 h-4 w-3/4 rounded-md" />
                            <div className="bg-white/5 h-6 w-1/2 rounded-md" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Header */}
            <div className="mb-10 space-y-6">
                <Link to="/" className="inline-flex items-center gap-2 text-indigo-400 font-bold text-sm hover:text-white transition-colors">
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-glow">
                        <Package size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tight fontFamily-space">
                            {slug}
                        </h1>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">
                            {products.length} items available
                        </p>
                    </div>
                </div>
            </div>

            {/* Results */}
            {error ? (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-2xl text-center">
                    <p className="font-bold">{error}</p>
                </div>
            ) : products.length === 0 ? (
                <div className="ss-card p-20 text-center">
                    <Package size={64} className="mx-auto text-slate-700 mb-6" />
                    <h2 className="text-2xl font-bold text-slate-400 uppercase mb-2 fontFamily-space">No products in this category</h2>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Check back soon for new arrivals</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
