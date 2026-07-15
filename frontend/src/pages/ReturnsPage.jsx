import React from 'react';
import { RefreshCcw, AlertCircle, CheckCircle } from 'lucide-react';

const ReturnsPage = () => {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-12" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <section className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white uppercase tracking-tight fontFamily-space">Returns & Refunds</h1>
                <p className="text-slate-400 font-medium">We want you to love what you ordered. But if something isn't right, let's fix it.</p>
            </section>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <RefreshCcw size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-white uppercase fontFamily-space">7-Day Easy Returns</h2>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-sm">
                            You have 7 days from the date of delivery to initiate a return. Items must be unused, in original packaging, and with all tags intact. We offer a "No Questions Asked" policy for defective or incorrect items.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h3 className="font-bold text-white uppercase text-sm tracking-widest border-b border-white/5 pb-3 fontFamily-space">Non-Returnable Items</h3>
                        <ul className="space-y-3 text-sm text-slate-300">
                            {[
                                "Beauty & Hygiene products (opened)",
                                "Undergarments and swimwear",
                                "Customized or personalized items",
                                "Items sold during Clearance sales"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <AlertCircle size={14} className="text-rose-400" /> {item}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className="ss-card p-6 space-y-6 h-fit">
                    <h3 className="font-bold text-white uppercase text-sm tracking-widest fontFamily-space">How to Return</h3>
                    <div className="space-y-4">
                        {[
                            "Log in to your account.",
                            "Go to 'Order History' in Profile.",
                            "Select the order and click 'Return'.",
                            "Pack the item securely.",
                            "Wait for our courier to pick it up."
                        ].map((step, i) => (
                            <div key={i} className="flex gap-3 text-sm text-slate-300">
                                <span className="font-bold text-indigo-400">{i + 1}.</span>
                                <span>{step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnsPage;
