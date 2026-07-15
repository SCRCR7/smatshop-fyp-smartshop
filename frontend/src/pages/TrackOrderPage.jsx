import React, { useState } from 'react';
import axios from 'axios';
import { Search, Package, MapPin, Truck, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import ImageWithFallback from '../components/ui/ImageWithFallback';

const TrackOrderPage = () => {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        setLoading(true);
        setError(null);
        setOrder(null);

        try {
            const { data } = await axios.get(`/api/v1/orders/${orderId}`);
            setOrder(data.order);
        } catch (err) {
            setError(err.response?.data?.message || 'Order not found. Please check the ID and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <h1 className="text-3xl font-bold text-white uppercase tracking-tight text-center mb-2 fontFamily-space">Track Your Order</h1>
            <p className="text-center text-slate-500 text-sm font-bold uppercase tracking-widest mb-10">Enter your Order ID to see current status</p>

            <div className="ss-card p-6 sm:p-8 mb-10">
                <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            placeholder="Enter Order Reference (e.g., 65b12...)"
                            className="w-full h-14 pl-12 pr-4 bg-white/[0.02] border border-white/5 rounded-xl font-bold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="h-14 px-8 bg-linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-glow"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} strokeWidth={3} />}
                        Track
                    </button>
                </form>
                {error && (
                    <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-xs font-bold uppercase tracking-wide">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}
            </div>

            {order && (
                <div className="ss-card overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-white/[0.01] border-b border-white/5 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Order Reference</p>
                            <p className="text-xl font-bold fontFamily-space">#{order._id}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Current Status</p>
                            <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase text-lg">
                                {order.status === 'Delivered' ? <CheckCircle size={20} className="text-[#10b981]" /> : <Truck size={20} />}
                                {order.status}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Progress Bar Mock */}
                        <div className="relative pt-6 pb-2">
                            <div className="h-2 bg-white/[0.02] border border-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                    style={{ width: order.status === 'Delivered' ? '100%' : order.status === 'Shipped' ? '75%' : order.status === 'Processing' ? '50%' : '25%' }}
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                <span>Placed</span>
                                <span>Processing</span>
                                <span>Shipped</span>
                                <span>Delivered</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 fontFamily-space">
                                    <MapPin size={16} className="text-indigo-400" /> Shipping Details
                                </h3>
                                <div className="p-5 bg-white/[0.01] border border-white/5 rounded-xl space-y-1 text-sm text-slate-300">
                                    <p className="font-bold text-white">{order.user?.name || 'Guest'}</p>
                                    <p>{order.shippingAddress?.address}</p>
                                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                                    <p>{order.shippingAddress?.country}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 fontFamily-space">
                                    <Package size={16} className="text-indigo-400" /> Order Items
                                </h3>
                                <div className="space-y-4">
                                    {order.orderItems.map((item, i) => (
                                        <div key={i} className="flex gap-3 items-center">
                                            <div className="w-10 h-10 bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden flex-shrink-0">
                                                <ImageWithFallback src={item.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-white truncate">{item.name}</p>
                                                <p className="text-[10px] text-slate-500 font-bold">Qty: {item.qty} x Rs.{item.price.toLocaleString()}</p>
                                            </div>
                                            <p className="text-xs font-bold text-[#10b981]">Rs.{(item.price * item.qty).toLocaleString()}</p>
                                        </div>
                                    ))}
                                    <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-3">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Total Amount</span>
                                        <span className="text-lg font-bold text-[#10b981] fontFamily-space">Rs.{order.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackOrderPage;
