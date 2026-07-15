import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    User,
    Package,
    Settings,
    ChevronRight,
    CreditCard,
    MapPin,
    ArrowRight,
    Loader2
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import { formatMonthYear, formatRelativeWithTime } from '../utils/dateUtils';
import useNow from '../hooks/useNow';

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');
    const now = useNow();

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const { data } = await axios.get('/api/v1/orders/myorders');
                setOrders(data.orders);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch orders');
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, []);

    const tabs = [
        { id: 'orders', name: 'My Orders', icon: Package },
        { id: 'profile', name: 'Account Settings', icon: User },
        { id: 'address', name: 'Shipping Address', icon: MapPin },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-xl border border-indigo-400/20">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white uppercase tracking-tight leading-none fontFamily-space">
                            Assalam-o-Alaikum, <br /> <span className="text-[#818cf8]">{user?.name}</span>
                        </h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">Member since {formatMonthYear(user?.createdAt)}</p>
                    </div>
                </div>

                <div className="flex bg-white/[0.02] border border-white/5 p-1.5 rounded-2xl backdrop-blur-md">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <tab.icon size={14} />
                            {tab.name}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Content Area */}
                <div className="lg:col-span-8">
                    {activeTab === 'orders' && (
                        <div className="space-y-6">
                            {loading ? (
                                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>
                            ) : orders.length > 0 ? (
                                orders.map(order => (
                                    <div key={order._id} className="ss-card overflow-hidden hover:border-indigo-500/30 transition-colors group">
                                        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 bg-white/[0.01]">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order Reference</p>
                                                <h3 className="text-sm font-bold text-white uppercase fontFamily-space">#{order._id.slice(-12)}</h3>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Status</p>
                                                <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Total</p>
                                                <p className="text-lg font-bold text-[#10b981] leading-none">Rs.{order.totalAmount.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="p-6 flex items-center justify-between">
                                            <div className="flex -space-x-3">
                                                {order.orderItems.slice(0, 4).map((item, i) => (
                                                    <div key={i} className="w-12 h-12 rounded-xl border-2 border-[#09080f] overflow-hidden shadow-sm bg-white/[0.02] border border-white/5">
                                                        <ImageWithFallback src={item.image} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                                {order.orderItems.length > 4 && (
                                                    <div className="w-12 h-12 rounded-xl border-2 border-[#09080f] bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-sm">
                                                        +{order.orderItems.length - 4}
                                                    </div>
                                                )}
                                            </div>
                                            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-indigo-400 group-hover:gap-4 transition-all">
                                                View Order Details <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white/[0.01] border border-white/5 border-dashed rounded-2xl">
                                    <Package className="mx-auto text-slate-600 mb-4" size={48} />
                                    <h3 className="text-xl font-bold text-slate-400 uppercase tracking-tight fontFamily-space">No orders found</h3>
                                    <Link to="/" className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mt-4 inline-block hover:underline italic">Start Shopping with Voice</Link>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="ss-card p-8 space-y-8">
                            <h3 className="text-xl font-bold uppercase tracking-tight border-b border-white/5 pb-4 text-white fontFamily-space">Personal Information</h3>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                                    <input type="text" value={user?.name} className="w-full h-12 bg-white/[0.02] border border-white/5 px-4 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                                    <input type="email" value={user?.email} className="w-full h-12 bg-white/[0.01] border border-white/5 px-4 rounded-xl text-sm font-bold text-slate-400 opacity-60 cursor-not-allowed" disabled />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">New Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full h-12 bg-white/[0.02] border border-white/5 px-4 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                                </div>
                                <div className="flex items-end">
                                    <button type="button" className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95">
                                        Update Profile
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Sidebar Stats */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="ss-card p-8 space-y-8 border-t-4 border-indigo-500">
                        <h3 className="text-lg font-bold uppercase tracking-tight text-white border-b border-white/5 pb-4 fontFamily-space">Account Credits</h3>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SmartShop Wallet</p>
                            <div className="flex justify-between items-end">
                                <h2 className="text-3xl font-bold text-white fontFamily-space">Rs. 0</h2>
                                <button className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:underline italic">Top Up</button>
                            </div>
                        </div>
                    </div>

                    <div className="ss-card p-8 space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/5 pb-4 text-slate-400 fontFamily-space">Security Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                                <span className="text-slate-500">2FA Status</span>
                                <span className="text-rose-500 font-bold">Disabled</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                                <span className="text-slate-500">Last Login</span>
                                <span className="text-white">{formatRelativeWithTime(user?.lastLogin, now)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
