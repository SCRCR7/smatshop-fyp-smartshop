import React from 'react';
import { Truck, Globe, Clock, Package } from 'lucide-react';

const ShippingPage = () => {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-12" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <section className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white uppercase tracking-tight fontFamily-space">Shipping & Logistics</h1>
                <p className="text-slate-400 font-medium">Fast, reliable, and trackable. We deliver to every corner of Pakistan.</p>
            </section>

            <section className="grid md:grid-cols-2 gap-8">
                <div className="ss-card p-8 flex items-start gap-4">
                    <Truck className="text-indigo-400 shrink-0 shadow-glow" size={32} />
                    <div>
                        <h3 className="text-lg font-bold text-white uppercase fontFamily-space">Standard Delivery</h3>
                        <p className="text-2xl font-bold text-[#10b981] mt-1">Rs. 199</p>
                        <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Flat Rate Nationwide</p>
                        <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                            Reliable overland shipping via our logistics partners (TCS, Leopards). Delivery typically takes 3-5 business days.
                        </p>
                    </div>
                </div>

                <div className="ss-card p-8 flex items-start gap-4 border-t-4 border-indigo-500">
                    <Package className="text-indigo-400 shrink-0 shadow-glow" size={32} />
                    <div>
                        <h3 className="text-lg font-bold text-white uppercase fontFamily-space">Free Shipping</h3>
                        <p className="text-2xl font-bold text-[#10b981] mt-1">Orders Rs. 5000+</p>
                        <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Automatic Qualifier</p>
                        <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                            Spend more than Rs. 5000 in a single cart and we'll cover the shipping costs entirely. No coupon code needed.
                        </p>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white uppercase border-b border-white/5 pb-4 fontFamily-space">Process Timeline</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: Clock, title: "Processing", desc: "1-2 Days", detail: "Order verification and packing." },
                        { icon: Truck, title: "Transit", desc: "2-3 Days", detail: "On the road to your city." },
                        { icon: Globe, title: "Last Mile", desc: "Same Day", detail: "Out for delivery to your doorstep." }
                    ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center text-center p-6 bg-white/[0.01] border border-white/5 rounded-2xl">
                            <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-400 mb-4">
                                <step.icon size={20} />
                            </div>
                            <h4 className="font-bold text-white uppercase">{step.title}</h4>
                            <p className="text-indigo-400 font-bold text-xl my-1">{step.desc}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{step.detail}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ShippingPage;
