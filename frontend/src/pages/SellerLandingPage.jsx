import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TrendingUp, ShieldCheck, Headphones, Globe, DollarSign, BarChart } from 'lucide-react';
import LearnMoreModal from '../components/LearnMoreModal';

const SellerLandingPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector(state => state.auth);
    const [learnMoreOpen, setLearnMoreOpen] = useState(false);

    // If already approved seller, redirect to seller dashboard
    React.useEffect(() => {
        const userData = localStorage.getItem('vstore_user');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.role === 'seller') {
                navigate('/seller/dashboard', { replace: true });
            }
        }
    }, [navigate]);

    const handleStartSelling = () => {
        if (isAuthenticated) {
            // Logged-in users go to Terms & Conditions
            navigate('/seller/terms');
        } else {
            // Non-logged-in users go to signup
            navigate('/signup?role=seller');
        }
    };

    return (
        <div className="w-full" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Hero Section */}
            <div className="relative overflow-hidden text-white py-16 sm:py-24 md:py-32 px-4 sm:px-6" style={{ background: 'radial-gradient(circle at 75% 20%, rgba(99,102,241,0.06) 0%, transparent 60%), var(--brand-dark)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center space-y-6 sm:space-y-8">
                    <span className="bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">Join the ecosystem</span>
                    <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight leading-none text-white fontFamily-space">
                        Become a <br />
                        <span className="text-indigo-400">SmartShop Seller</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl font-medium leading-relaxed">
                        Unlock access to millions of customers through our AI-powered marketplace. Start your journey today and grow your business exponentially.
                    </p>
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleStartSelling}
                            className="h-14 px-10 bg-linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) bg-indigo-600 hover:brightness-110 text-white font-bold text-sm uppercase tracking-[0.2em] rounded-xl shadow-glow transition-all active:scale-95"
                        >
                            Start Selling
                        </button>
                        <button
                            onClick={() => setLearnMoreOpen(true)}
                            className="h-14 px-10 bg-white/5 hover:bg-white/10 border border-white/8 text-white font-bold text-sm uppercase tracking-[0.2em] rounded-xl backdrop-blur-sm transition-all active:scale-95"
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            {/* Benefits Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: DollarSign, title: '0% Commission', desc: 'Enjoy 0% commission on your sales for the first 30 days of registration.' },
                        { icon: Globe, title: 'Nationwide Reach', desc: 'Deliver to over 500+ cities across Pakistan with our integrated logistics.' },
                        { icon: Headphones, title: '24/7 Seller Support', desc: 'Dedicated support team to help you manage your store around the clock.' },
                        { icon: TrendingUp, title: 'Growth Tools', desc: 'Advanced analytics dashboard to track performance and optimize sales.' },
                        { icon: ShieldCheck, title: 'Secure Payments', desc: 'Verified weekly payouts directly to your bank account.' },
                        { icon: BarChart, title: 'Product Promotion', desc: 'Your products get promoted to relevant customers through our smart recommendation system.' },
                    ].map((feature, i) => (
                        <div key={i} className="ss-card p-8 group hover:-translate-y-1 hover:border-indigo-500/30 transition-all duration-300">
                            <div className="w-12 h-12 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors shadow-sm">
                                <feature.icon size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-white uppercase mb-3 fontFamily-space">{feature.title}</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Strip */}
            <div className="py-20 px-6 text-center border-t border-b border-white/5 relative overflow-hidden" style={{ background: '#09080f' }}>
                <div style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 60%)', position: 'absolute', inset: 0, zIndex: 0 }} />
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white uppercase tracking-tight mb-8 fontFamily-space">Ready to transform your business?</h2>
                    <Link to="/signup?role=seller">
                        <button className="h-14 px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-glow transition-all active:scale-95">
                            Register Now
                        </button>
                    </Link>
                </div>
            </div>

            {/* Learn More Modal */}
            <LearnMoreModal isOpen={learnMoreOpen} onClose={() => setLearnMoreOpen(false)} />
        </div>
    );
};

export default SellerLandingPage;
