import React from 'react';
import { Smartphone, Star, Download, Apple } from 'lucide-react';

const MobileAppPage = () => {
    return (
        <div className="w-full bg-var(--brand-dark) min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12" style={{ background: 'var(--brand-dark)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div className="bg-white/[0.01] border border-white/5 max-w-5xl w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative backdrop-blur-lg">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

                {/* Left Content */}
                <div className="flex-1 p-8 sm:p-12 md:p-20 flex flex-col justify-center relative z-10">
                    <span className="text-[#818cf8] font-bold text-[10px] uppercase tracking-[0.3em] mb-4">Mobile Shopping Experience</span>
                    <h1 className="text-5xl font-bold text-white uppercase tracking-tight leading-none mb-6 fontFamily-space">
                        Shop Smarter <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818cf8] to-indigo-500">On The Go.</span>
                    </h1>
                    <p className="text-slate-400 text-lg mb-10 max-w-md leading-relaxed">
                        Download the SmartShop app for exclusive deals, voice-first navigation, and real-time order tracking.
                    </p>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-white p-2.5 rounded-xl border border-white/10 shadow-lg">
                                <img
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SmartShopApp"
                                    alt="QR Code"
                                    className="w-24 h-24 mix-blend-multiply rounded-lg"
                                />
                            </div>
                            <div className="text-white space-y-1">
                                <p className="font-bold text-sm">Scan to Download</p>
                                <p className="text-xs text-slate-500">iOS & Android Compatible</p>
                                <div className="flex text-yellow-400 text-xs mt-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" color="currentColor" />)}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/8 rounded-xl px-4 py-3 transition-all">
                                <Apple className="text-white" size={24} />
                                <div className="text-left">
                                    <p className="text-[9px] text-slate-500 font-bold uppercase">Download on the</p>
                                    <p className="text-sm font-bold text-white leading-none">App Store</p>
                                </div>
                            </button>
                            <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/8 rounded-xl px-4 py-3 transition-all">
                                <Smartphone className="text-white" size={24} />
                                <div className="text-left">
                                    <p className="text-[9px] text-slate-500 font-bold uppercase">Get it on</p>
                                    <p className="text-sm font-bold text-white leading-none">Google Play</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Visual (Mockup) */}
                <div className="flex-1 relative min-h-[400px] md:min-h-auto bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center p-10">
                    <div className="relative w-64 h-[500px] bg-black rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                        {/* Mock App Screen */}
                        <div className="w-full h-full bg-[#07070c] flex flex-col border border-white/5">
                            <div className="bg-indigo-600 h-20 w-full flex items-end p-4 shadow-lg">
                                <span className="text-white font-bold italic text-xl fontFamily-space">SmartShop</span>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="h-32 bg-white/[0.02] border border-white/5 rounded-xl animate-pulse" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-32 bg-white/[0.02] border border-white/5 rounded-xl animate-pulse" />
                                    <div className="h-32 bg-white/[0.02] border border-white/5 rounded-xl animate-pulse" />
                                </div>
                            </div>
                            <div className="mt-auto h-16 border-t border-white/5 flex justify-around items-center text-slate-700 bg-white/[0.01]">
                                <div className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/5" />
                                <div className="w-8 h-8 rounded-full bg-indigo-600 shadow-glow" />
                                <div className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileAppPage;
