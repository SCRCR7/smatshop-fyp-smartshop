import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    ShoppingCart,
    Eye,
    Truck,
    Clock,
    CheckCircle,
    XCircle,
    Loader2,
    Search
} from 'lucide-react';
import { formatMonthDay } from '../../utils/dateUtils';

const OrderListPage = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('vstore_token');
                const { data } = await axios.get('/api/v1/orders', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setOrders(data.orders);
                setFilteredOrders(data.orders);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        const results = orders.filter(o =>
            o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.isGuestOrder ? o.guestName : (o.user?.name || '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.isGuestOrder ? o.guestEmail : (o.user?.email || '')).toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredOrders(results);
    }, [searchTerm, orders]);

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-brand-orange" size={48} /></div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex justify-between items-center">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search Orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-sm text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-brand-orange/20 outline-none w-64"
                    />
                </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 italic">
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Order ID</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Customer</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Value</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Payment</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Delivery</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredOrders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-black text-xs text-brand-navy uppercase italic">#{order._id.slice(-12)}</td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-black text-brand-navy uppercase tracking-tighter">{order.isGuestOrder ? order.guestName : (order.user?.name || 'N/A')}</p>
                                    <p className="text-[10px] text-gray-400 font-bold">{order.isGuestOrder ? order.guestEmail : (order.user?.email || 'N/A')}</p>
                                </td>
                                <td className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase">{formatMonthDay(order.createdAt)}</td>
                                <td className="px-6 py-4 text-sm font-black text-brand-orange italic">Rs.{order.totalAmount.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <div className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${order.isPaid ? 'text-green-600' : 'text-red-500'}`}>
                                        {order.isPaid ? <CheckCircle size={12} /> : <Clock size={12} />}
                                        {order.isPaid ? 'Paid' : 'Pending'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${order.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-brand-orange border-orange-100'}`}>
                                        {order.status}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link to={`/admin/orders/${order._id}`}>
                                        <button className="bg-brand-navy text-white p-2 rounded-sm hover:bg-black shadow-lg transition-all active:scale-95">
                                            <Eye size={16} />
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderListPage;
