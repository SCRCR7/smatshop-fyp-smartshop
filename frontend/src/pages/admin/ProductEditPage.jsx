import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Save,
    ArrowLeft,
    Image as ImageIcon,
    Tag,
    Box,
    Package,
    FileText,
    Loader2,
    CheckCircle2
} from 'lucide-react';

const ProductEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        images: '',
        category: '',
        stock: '',
        description: ''
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/v1/products/${id}`);
                const p = data.product;
                setFormData({
                    title: p.title,
                    price: p.price,
                    images: p.images.join(','),
                    category: p.category,
                    stock: p.stock,
                    description: p.description
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const token = localStorage.getItem('vstore_token');
            await axios.put(`/api/v1/products/${id}`, {
                ...formData,
                images: formData.images.split(',')
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUpdateLoading(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
            setUpdateLoading(false);
        }
    };

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-brand-orange" size={48} /></div>;

    return (
        <div className="max-w-4xl space-y-8">
            <Link to="/admin/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-orange transition-colors">
                <ArrowLeft size={16} /> Back to Catalog
            </Link>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-10 rounded-sm shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 relative overflow-hidden">
                    {success && (
                        <div className="absolute top-0 left-0 right-0 bg-green-500 text-white py-2 text-center text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top duration-300">
                            Product Updated Successfully
                        </div>
                    )}

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <Tag size={12} /> Product Identity (Title)
                        </label>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full h-14 bg-gray-50 border-none rounded-sm px-6 text-sm font-black text-brand-navy uppercase tracking-tighter focus:bg-white focus:ring-2 focus:ring-brand-orange/20 transition-all outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <Box size={12} /> Unit Value (PKR)
                        </label>
                        <input
                            required
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full h-14 bg-gray-50 border-none rounded-sm px-6 text-sm font-black text-brand-orange italic focus:bg-white focus:ring-2 focus:ring-brand-orange/20 transition-all outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <Package size={12} /> Inventory Units
                        </label>
                        <input
                            required
                            type="number"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            className="w-full h-14 bg-gray-50 border-none rounded-sm px-6 text-sm font-black text-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-orange/20 transition-all outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <Tag size={12} /> Category
                        </label>
                        <input
                            required
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full h-14 bg-gray-50 border-none rounded-sm px-6 text-sm font-black text-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-orange/20 transition-all outline-none"
                            placeholder="e.g. Electronics, Mobiles, Laptops"
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <ImageIcon size={12} /> Media Arrays (Comma separated URLs)
                        </label>
                        <textarea
                            required
                            value={formData.images}
                            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                            className="w-full h-24 bg-gray-50 border-none rounded-sm p-6 text-[10px] font-bold text-gray-400 focus:bg-white focus:ring-2 focus:ring-brand-orange/20 transition-all outline-none resize-none"
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <FileText size={12} /> Product Description
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full h-40 bg-gray-50 border-none rounded-sm p-6 text-sm font-medium text-gray-600 leading-relaxed focus:bg-white focus:ring-2 focus:ring-brand-orange/20 transition-all outline-none"
                        />
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button
                            disabled={updateLoading}
                            type="submit"
                            className="w-full h-16 bg-brand-navy text-white font-black text-xs uppercase tracking-[0.3em] rounded-sm shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {updateLoading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                            {updateLoading ? 'Synchronizing...' : 'Saves Changes to Central DB'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductEditPage;
