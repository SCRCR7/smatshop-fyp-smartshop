import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    Package,
    Search,
    Loader2,
    AlertCircle
} from 'lucide-react';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/v1/products?limit=100');
            setProducts(data.products);
            setFilteredProducts(data.products);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch products');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const results = products.filter(p =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p._id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(results);
    }, [searchTerm, products]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`/api/v1/products/${id}`);
                fetchProducts();
            } catch (err) {
                alert(err.response?.data?.message || 'Delete failed');
            }
        }
    };

    const createProductHandler = () => {
        navigate('/seller/add-product');
    };

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-brand-orange" size={48} /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-sm shadow-sm border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Filter Inventory..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-sm text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-brand-orange/20 outline-none w-64"
                    />
                </div>
                <button
                    onClick={createProductHandler}
                    className="bg-brand-orange text-white px-6 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 shadow-xl transition-all flex items-center gap-2"
                >
                    <Plus size={16} /> Add New Entry
                </button>
            </div>

            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 italic">
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Product SKU</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Visual</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Identity</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Category</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Value (PKR)</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Stock Unit</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredProducts.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-black text-xs text-brand-navy">#{product._id.slice(-8)}</td>
                                <td className="px-6 py-4">
                                    <div className="w-10 h-10 rounded-sm bg-gray-100 border p-1 border-gray-100 overflow-hidden">
                                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-black text-brand-navy uppercase tracking-tighter line-clamp-1">{product.title}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-100 px-2 py-1 rounded-sm">{product.category}</span>
                                </td>
                                <td className="px-6 py-4 text-sm font-black text-brand-orange">Rs.{product.price.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <div className={`text-[10px] font-black uppercase flex items-center gap-2 ${product.stock > 10 ? 'text-green-600' : 'text-red-500'}`}>
                                        {product.stock} Units
                                        {product.stock <= 10 && <AlertCircle size={12} className="animate-pulse" />}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link to={`/admin/products/${product._id}/edit`}>
                                            <button className="p-2 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 rounded-sm text-gray-400 hover:text-brand-orange transition-all">
                                                <Edit size={16} />
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => deleteHandler(product._id)}
                                            className="p-2 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 rounded-sm text-gray-400 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductListPage;
