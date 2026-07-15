import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBasket, ArrowLeft, ShieldCheck } from 'lucide-react';
import { removeFromCart, updateQty, selectCartTotal, selectCartCount } from '../store/slices/cartSlice';

const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items } = useSelector(state => state.cart);
    const total = useSelector(selectCartTotal);
    const count = useSelector(selectCartCount);

    if (items.length === 0) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-40 flex flex-col items-center justify-center space-y-10 ss-card border border-white/5 relative overflow-hidden">
                <div style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', position: 'absolute', inset: 0, zIndex: -1 }} />
                <div className="w-36 h-36 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center text-indigo-500 shadow-inner">
                    <ShoppingBasket size={80} strokeWidth={1.5} />
                </div>
                <div className="text-center space-y-3">
                    <h2 className="text-4xl font-extrabold uppercase tracking-tight text-white fontFamily-space">Your cart is empty.</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Fill it with the things you love</p>
                </div>
                <Link to="/">
                    <button className="bg-indigo-600 text-white px-12 py-4 font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-2xl hover:bg-indigo-500 transition-all active:scale-95">PROCEED TO SHOPPING</button>
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Detailed Listing Stack */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="ss-card p-6 flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-white fontFamily-space">My Shopping Cart ({count})</h2>
                        <Link to="/" className="text-[10px] font-bold text-[#818cf8] uppercase flex items-center gap-3 hover:text-white transition-colors tracking-widest border border-indigo-500/20 px-4 py-2 rounded-xl bg-white/[0.01]">
                            <ArrowLeft size={14} /> Back to Market
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {items.map(item => (
                            <div key={`${item._id}-${item.variant}`} className="ss-card p-6 flex flex-col md:flex-row items-center gap-8 group relative">
                                <div className="w-28 h-28 bg-[#09080f] rounded-xl overflow-hidden shrink-0 border border-white/5 shadow-sm relative">
                                    <img src={item.images?.[0] || 'https://via.placeholder.com/200'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>

                                <div className="flex-1 space-y-2 text-center md:text-left">
                                    <Link to={`/product/${item._id}`} className="text-lg font-bold text-white hover:text-indigo-400 transition-colors leading-tight line-clamp-2 uppercase">
                                        {item.title}
                                    </Link>
                                    <div className="flex items-center justify-center md:justify-start gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        <span>Var: <span className="text-slate-300">{item.variant}</span></span>
                                        <span>Condition: <span className="text-emerald-500 italic">Pre-Check Success</span></span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-1 min-w-[140px]">
                                    <span className="text-2xl font-bold text-[#10b981] tracking-tight">Rs.{item.price.toLocaleString()}</span>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest line-through">Rs.{(item.price * 1.3).toLocaleString()}</span>
                                </div>

                                {/* Qty Controls */}
                                <div className="flex items-center border border-white/5 rounded-xl bg-white/[0.01] overflow-hidden shadow-sm">
                                    <button onClick={() => dispatch(updateQty({ id: item._id, variant: item.variant, qty: item.qty - 1 }))} className="w-12 h-12 hover:bg-white/5 text-white font-bold transition-all border-r border-white/5">-</button>
                                    <span className="w-14 h-12 flex items-center justify-center font-bold text-lg text-white select-none">{item.qty}</span>
                                    <button onClick={() => dispatch(updateQty({ id: item._id, variant: item.variant, qty: item.qty + 1 }))} className="w-12 h-12 hover:bg-white/5 text-white font-bold transition-all border-l border-white/5">+</button>
                                </div>

                                <button
                                    onClick={() => dispatch(removeFromCart({ id: item._id, variant: item.variant }))}
                                    className="p-4 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-all active:scale-95"
                                >
                                    <Trash2 size={20} strokeWidth={2} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Professional Summary Column */}
                <div className="lg:col-span-4 sticky top-[130px] space-y-4">
                    <div className="ss-card p-8 space-y-8 text-white relative overflow-hidden border-t-4 border-indigo-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16" />

                        <h3 className="text-2xl font-bold uppercase tracking-tight text-white border-b border-white/5 pb-6 fontFamily-space">Final Summary</h3>

                        <div className="space-y-6 text-[11px] font-bold uppercase tracking-[0.2em]">
                            <div className="flex justify-between text-slate-400">
                                <span>Merchandise ({count} items)</span>
                                <span className="text-white tracking-widest">Rs.{total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Logistics Fee</span>
                                <span className="text-[#10b981] font-bold italic tracking-widest">FREE</span>
                            </div>
                            <div className="pt-8 border-t border-white/5 flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-slate-500 mb-1">TOTAL PAYABLE</span>
                                    <span className="text-3xl font-bold text-[#10b981] tracking-tight">Rs.{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <button onClick={() => navigate('/checkout')} className="w-full h-16 bg-linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) bg-indigo-600 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-xl hover:bg-indigo-500 transition-all active:scale-95">ORDER NOW</button>
                            <div className="flex items-center justify-center gap-3 text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2 opacity-80">
                                <ShieldCheck size={14} className="text-[#10b981]" /> Verified Secure Gateway
                            </div>
                        </div>
                    </div>

                    {/* Voucher Logic Mock */}
                    <div className="ss-card p-6 flex gap-4 items-center">
                        <input type="text" placeholder="Promo Code?" className="flex-1 h-12 bg-white/[0.02] border border-white/5 rounded-xl px-6 font-bold text-[10px] uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
                        <button className="h-12 px-6 border border-indigo-500 text-indigo-400 font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all rounded-xl">Apply</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
