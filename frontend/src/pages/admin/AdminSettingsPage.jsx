import React, { useState } from 'react';
import FlashSaleAdminPanel from './FlashSaleAdminPanel';
import {
    Settings,
    Bell,
    Shield,
    Globe,
    Save,
    CheckCircle2,
    Database,
    Cpu
} from 'lucide-react';

const AdminSettingsPage = () => {
    const [success, setSuccess] = useState(false);

    const handleSave = () => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <div className="max-w-4xl space-y-8">
            <div className="bg-white p-10 rounded-sm shadow-sm border border-gray-100 relative overflow-hidden">
                {success && (
                    <div className="absolute top-0 left-0 right-0 bg-brand-orange text-white py-2 text-center text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top duration-300">
                        Platform Settings Updated
                    </div>
                )}

                <div className="space-y-12">
                    <section className="space-y-6">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-brand-navy border-b border-gray-50 pb-4 flex items-center gap-3">
                            <Cpu size={24} className="text-brand-orange" /> Platform Configuration
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Storefront Identity</label>
                                <input type="text" defaultValue="SmartShop Enterprise" className="w-full h-14 bg-gray-50 border-none rounded-sm px-6 text-sm font-black text-brand-navy outline-none focus:ring-2 focus:ring-brand-orange/20 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Currency Protocol</label>
                                <select className="w-full h-14 bg-gray-50 border-none rounded-sm px-6 text-[10px] font-black uppercase tracking-widest text-brand-navy outline-none">
                                    <option>PKR - Pakistani Rupee</option>
                                    <option>USD - Central Reserve</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-brand-navy border-b border-gray-50 pb-4 flex items-center gap-3">
                            <Bell size={24} className="text-brand-orange" /> Notification Manifest
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Internal Order Alerts', desc: 'Sync with SmartShop mobile app' },
                                { label: 'Inventory Threshold Warning', desc: 'Notify when stock matches < 10 units' },
                                { label: 'New Prototype Registration', desc: 'Alert upon new user entry' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-sm border border-transparent hover:border-brand-orange/10 transition-all">
                                    <div>
                                        <p className="text-xs font-black text-brand-navy uppercase tracking-widest">{item.label}</p>
                                        <p className="text-[10px] text-gray-400 font-bold">{item.desc}</p>
                                    </div>
                                    <div className="w-12 h-6 bg-brand-orange rounded-full relative p-1 cursor-pointer">
                                        <div className="w-4 h-4 bg-white rounded-full translate-x-6" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="pt-6 border-t border-gray-50">
                        <button
                            onClick={handleSave}
                            className="w-full h-16 bg-brand-navy text-white font-black text-xs uppercase tracking-[0.3em] rounded-sm shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3"
                        >
                            <Save size={18} /> Synchronize All Nodes
                        </button>
                    </div>
                </div>
            </div>
            {/* Flash Sale Management */}
            <FlashSaleAdminPanel />
        </div>
    );
};

export default AdminSettingsPage;
