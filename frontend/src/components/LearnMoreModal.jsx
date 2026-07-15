import React from 'react';
import { X, Users, TrendingUp, Lock, Headphones, BarChart3, Zap, Award } from 'lucide-react';

const LearnMoreModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const advantages = [
        {
            icon: Users,
            title: 'Access to Millions of Customers',
            description: 'Tap into our massive user base and significantly expand your customer reach beyond your current market.'
        },
        {
            icon: Zap,
            title: 'Easy Product Listing & Management',
            description: 'Simple, intuitive tools to list products, manage inventory, and update product details in just minutes.'
        },
        {
            icon: Lock,
            title: 'Secure & Fast Payments',
            description: 'Your earnings are protected with secure payment processing. Get paid directly to your bank account weekly.'
        },
        {
            icon: TrendingUp,
            title: 'Marketing & Visibility Support',
            description: 'Benefit from SmartShop\'s smart recommendation engine and promotional features to boost product visibility.'
        },
        {
            icon: BarChart3,
            title: 'Seller Performance Insights',
            description: 'Access comprehensive analytics and performance metrics to understand customer behavior and optimize your sales.'
        },
        {
            icon: Headphones,
            title: '24/7 Dedicated Seller Support',
            description: 'Our support team is always available to help you with any issues, questions, or concerns about selling on SmartShop.'
        },
        {
            icon: Award,
            title: 'Platform Trust & Credibility',
            description: 'Build your business on a trusted platform. Customers feel confident purchasing from SmartShop sellers.'
        },
        {
            icon: Lock,
            title: 'Buyer Protection & Dispute Resolution',
            description: 'SmartShop\'s buyer protection policies ensure fair treatment while protecting sellers from fraudulent claims.'
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div className="bg-brand-dark/95 border border-white/5 rounded-2xl max-w-4xl w-full shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#09080f] to-[#141324] text-white p-6 sm:p-8 relative flex-shrink-0 border-b border-white/5">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-white fontFamily-space">
                        Why Sell on SmartShop?
                    </h2>
                    <p className="text-slate-400 mt-2 text-sm font-medium">
                        Discover the advantages of becoming a SmartShop seller
                    </p>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1">
                    <div className="p-6 sm:p-8">
                        {/* Intro */}
                        <div className="mb-8 p-6 bg-indigo-500/5 border border-indigo-500/15 rounded-2xl">
                            <p className="text-slate-200 leading-relaxed text-base font-medium">
                                SmartShop provides sellers with a powerful platform to reach millions of customers, manage their business efficiently, and grow their revenue. Here's what you get when you join our seller community:
                            </p>
                        </div>

                        {/* Advantages Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {advantages.map((advantage, index) => (
                                <div
                                    key={index}
                                    className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all duration-350 group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                <advantage.icon className="h-6 w-6 text-indigo-400 group-hover:text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-bold text-white uppercase mb-2 fontFamily-space">
                                                {advantage.title}
                                            </h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">
                                                {advantage.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom CTA */}
                        <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-white uppercase mb-3 fontFamily-space">
                                Ready to Get Started?
                            </h3>
                            <p className="text-slate-400 mb-4 text-sm leading-relaxed">
                                Joining SmartShop is simple. Click "Start Selling" to begin your seller application process. Our team reviews applications to ensure platform quality and buyer safety.
                            </p>
                            <ul className="space-y-2.5 text-slate-300 text-sm font-medium">
                                <li className="flex gap-2">
                                    <span className="text-indigo-400 font-bold">•</span>
                                    <span>Complete seller application (takes 5 minutes)</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-indigo-400 font-bold">•</span>
                                    <span>Admin approval process (typically 24-48 hours)</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-indigo-400 font-bold">•</span>
                                    <span>Access your seller dashboard and start listing products</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer - Fixed */}
                <div className="bg-white/[0.01] px-6 sm:px-8 py-4 border-t border-white/5 flex gap-3 justify-end flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 border border-white/10 hover:bg-white/5 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                    >
                        Close
                    </button>
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) bg-indigo-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-glow transition-all active:scale-95"
                    >
                        Start Selling
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LearnMoreModal;
