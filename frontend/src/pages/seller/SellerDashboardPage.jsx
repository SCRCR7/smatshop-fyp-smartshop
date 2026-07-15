import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2, Plus, Package, TrendingUp, DollarSign, Eye } from 'lucide-react';
import axios from 'axios';

const SellerDashboardPage = () => {
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalSales: 0,
        totalRevenue: 0
    });
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    useEffect(() => {
        const fetchSellerProducts = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('vstore_token')}`
                    }
                };
                
                const { data } = await axios.get('/api/v1/products/my-products', config);
                setProducts(data.products || []);
                
                // Calculate stats
                setStats({
                    totalProducts: data.products?.length || 0,
                    totalSales: data.products?.reduce((sum, p) => sum + (p.numReviews || 0), 0) || 0,
                    totalRevenue: data.products?.reduce((sum, p) => sum + (p.price * (p.numReviews || 0)), 0) || 0
                });
                
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setLoading(false);
            }
        };

        const fetchSellerOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('vstore_token')}`
                    }
                };
                const { data } = await axios.get('/api/v1/orders/seller/my-orders', config);
                setOrders(data.orders || []);
                setOrdersLoading(false);
            } catch (err) {
                console.error('Failed to fetch seller orders:', err);
                setOrdersLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchSellerProducts();
            fetchSellerOrders();
        }
    }, [isAuthenticated]);

    // Update stats based on orders
    useEffect(() => {
        if (!ordersLoading && orders.length > 0) {
            const totalSales = orders.reduce((sum, order) => sum + order.orderItems.reduce((s, item) => s + item.qty, 0), 0);
            const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
            setStats(prev => ({
                ...prev,
                totalSales,
                totalRevenue
            }));
        }
    }, [orders, ordersLoading]);

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-brand-orange" size={48} />
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
            {/* Header */}
            <header className="mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-brand-navy uppercase italic tracking-tighter leading-none">
                            Seller Dashboard
                        </h1>
                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.15em] leading-relaxed mt-2">
                            Manage your products and grow your business
                        </p>
                    </div>
                    <Link to="/seller/add-product">
                        <button className="h-14 px-8 bg-brand-orange hover:bg-orange-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-sm shadow-xl transition-all flex items-center gap-3 active:scale-95">
                            <Plus size={18} />
                            Add Product
                        </button>
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Products</p>
                        <Package className="text-brand-orange" size={24} />
                    </div>
                    <h2 className="text-4xl font-black text-brand-navy italic">{stats.totalProducts}</h2>
                    <p className="text-xs text-gray-500">Active listings</p>
                </div>

                <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Sales</p>
                        <TrendingUp className="text-green-500" size={24} />
                    </div>
                    <h2 className="text-4xl font-black text-brand-navy italic">{stats.totalSales}</h2>
                    <p className="text-xs text-gray-500">Total orders received</p>
                </div>

                <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Revenue</p>
                        <DollarSign className="text-blue-500" size={24} />
                    </div>
                    <h2 className="text-4xl font-black text-brand-orange italic">Rs. {stats.totalRevenue.toLocaleString()}</h2>
                    <p className="text-xs text-gray-500">Estimated earnings</p>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-lg font-black text-brand-navy uppercase italic tracking-tighter">Your Products</h3>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50/50">
                        <Package className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-xl font-black text-gray-400 uppercase tracking-tighter mb-4">No Products Yet</h3>
                        <p className="text-gray-500 text-sm mb-6">Start building your store by adding your first product</p>
                        <Link to="/seller/add-product">
                            <button className="h-12 px-8 bg-brand-orange hover:bg-orange-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-sm shadow-lg transition-all">
                                Add Your First Product
                            </button>
                        </Link>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Product Name</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Price</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Stock</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Views</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map(product => (
                                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {product.images?.[0] && (
                                                <img 
                                                    src={product.images[0]} 
                                                    alt={product.title} 
                                                    className="w-12 h-12 rounded-sm object-cover border border-gray-100"
                                                />
                                            )}
                                            <div>
                                                <p className="text-sm font-black text-brand-navy uppercase tracking-tighter">{product.title}</p>
                                                <p className="text-[10px] text-gray-500 font-bold">{product.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-black text-brand-orange italic">Rs. {product.price.toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-black text-gray-700">{product.stock} units</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm font-black text-gray-600">
                                            <Eye size={16} />
                                            {product.numReviews || 0}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link to={`/seller/products/${product._id}/edit`}>
                                            <button className="text-brand-orange hover:text-orange-600 font-black text-xs uppercase tracking-[0.15em] transition-colors">
                                                Edit
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Seller Orders Table */}
            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden mt-12">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-lg font-black text-brand-navy uppercase italic tracking-tighter">Your Orders (All Buyers)</h3>
                </div>
                {ordersLoading ? (
                    <div className="text-center py-20 bg-gray-50/50">
                        <Loader2 className="mx-auto animate-spin text-brand-orange mb-4" size={48} />
                        <p className="text-gray-500 text-sm">Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50/50">
                        <Package className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-xl font-black text-gray-400 uppercase tracking-tighter mb-4">No Orders Yet</h3>
                        <p className="text-gray-500 text-sm mb-6">You have not sold any products yet.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Order ID</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Buyer</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Items</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Total</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map(order => (
                                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-mono">{order._id}</td>
                                    <td className="px-6 py-4 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-xs">
                                        {order.buyer ? (
                                            <span>{order.buyer.name} <span className="text-gray-400">(User)</span></span>
                                        ) : (
                                            <span>{order.guestName} <span className="text-gray-400">(Guest)</span><br/>{order.guestEmail}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        <ul>
                                            {order.orderItems.map(item => (
                                                <li key={item.product}>
                                                    {item.name} x {item.qty} @ Rs. {item.price}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-brand-orange">Rs. {order.totalAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-xs">{order.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SellerDashboardPage;
