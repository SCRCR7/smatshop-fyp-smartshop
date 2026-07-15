import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft,
    Package,
    Truck,
    CreditCard,
    User,
    CheckCircle,
    Loader2,
    MapPin,
    Phone
} from 'lucide-react';

const OrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);

    const fetchOrder = async () => {
        try {
            const token = localStorage.getItem('vstore_token');
            const { data } = await axios.get(`/api/v1/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(data.order);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const deliverHandler = async () => {
        setUpdateLoading(true);
        try {
            const token = localStorage.getItem('vstore_token');
            await axios.put(`/api/v1/orders/${id}/deliver`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchOrder();
            setUpdateLoading(false);
        } catch (err) {
            alert('Fulfillment failed');
            setUpdateLoading(false);
        }
    };

    const payHandler = async () => {
        setUpdateLoading(true);
        try {
            const token = localStorage.getItem('vstore_token');
            await axios.put(`/api/v1/orders/${id}/pay`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchOrder();
            setUpdateLoading(false);
        } catch (err) {
            alert('Payment update failed');
            setUpdateLoading(false);
        }
    };

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-brand-orange" size={48} /></div>;

    return (
        <div className="space-y-8">
            <Link to="/admin/orders" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-orange transition-colors">
                <ArrowLeft size={16} /> Back to Operations
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Core Details */}
                <div className="lg:col-span-8 space-y-10">
                    {/* User Info Card */}
                    <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-brand-navy flex items-center gap-2 border-b border-gray-50 pb-4">
                                <User size={16} className="text-brand-orange" /> Consignee Metadata
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Designated Name</p>
                                    <p className="text-sm font-black text-brand-navy uppercase">{order.isGuestOrder ? order.guestName : (order.user?.name || 'N/A')}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                    <p className="text-sm font-bold text-gray-600">{order.isGuestOrder ? order.guestEmail : (order.user?.email || 'N/A')}</p>
                                </div>
                                {(order.isGuestOrder ? order.guestPhone : order.user?.phone) && (
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                                        <p className="text-sm font-bold text-gray-600">{order.isGuestOrder ? order.guestPhone : order.user?.phone}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6 text-right">
                            <h3 className="text-sm font-black uppercase tracking-widest text-brand-navy flex items-center gap-2 justify-end border-b border-gray-50 pb-4">
                                <MapPin size={16} className="text-brand-orange" /> Delivery Logic
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Address</p>
                                    <p className="text-sm font-bold text-gray-600 uppercase italic leading-tight">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-widest text-brand-navy">Order Items</h3>
                            <div className="px-3 py-1 bg-brand-navy text-white text-[9px] font-black uppercase rounded-sm">{order.orderItems.length} Units Payload</div>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {order.orderItems.map((item, i) => (
                                <div key={i} className="p-6 flex items-center gap-6 hover:bg-gray-50/50 transition-all">
                                    <div className="w-16 h-16 bg-gray-100 border border-gray-100 rounded-sm overflow-hidden p-1">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-black text-brand-navy uppercase tracking-tighter italic">{item.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Quantity Manifest: {item.qty}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-brand-navy">Rs. {item.price?.toLocaleString()}</p>
                                        <p className="text-[10px] font-bold text-brand-orange uppercase">Subtotal Sync</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Operational Controls */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-brand-navy text-white p-8 rounded-sm shadow-2xl border-b-8 border-brand-orange space-y-8">
                        <h3 className="text-lg font-black uppercase tracking-tighter italic border-b border-white/10 pb-4">Fulfillment Hub</h3>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Financial Status</span>
                                <div className={`px-2 py-1 rounded-sm text-[9px] font-black uppercase ${order.isPaid ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {order.isPaid ? 'Liquidated' : 'Pending Verification'}
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Payload Status</span>
                                <div className={`px-2 py-1 rounded-sm text-[9px] font-black uppercase ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-brand-orange border border-orange-500/20'}`}>
                                    {order.status}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 space-y-3 font-black italic">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] uppercase text-gray-400">Total Transaction Value</span>
                                <span className="text-2xl text-brand-orange">Rs. {order.totalAmount?.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            {!order.isPaid && (
                                <button
                                    onClick={payHandler}
                                    disabled={updateLoading}
                                    className="w-full h-14 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all shadow-xl flex items-center justify-center gap-2"
                                >
                                    {updateLoading ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />}
                                    Reconcile Payment (Mark Paid)
                                </button>
                            )}

                            {order.status !== 'Delivered' && (
                                <button
                                    onClick={deliverHandler}
                                    disabled={updateLoading}
                                    className="w-full h-14 bg-brand-orange hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all shadow-xl flex items-center justify-center gap-2"
                                >
                                    {updateLoading ? <Loader2 className="animate-spin" size={16} /> : <Truck size={16} />}
                                    Initiate Fulfillment (Mark Delivered)
                                </button>
                            )}

                            {order.status === 'Delivered' && order.isPaid && (
                                <div className="text-center py-4 bg-white/5 border border-white/10 rounded-sm">
                                    <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-green-500 italic">Lifecycle Complete</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
