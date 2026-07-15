import React from 'react';
import { FileText } from 'lucide-react';

const TermsPage = () => {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl shadow-glow">
                    <FileText size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight fontFamily-space">Terms of Service</h1>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Effective Date: January 1, 2026</p>
                </div>
            </div>

            <div className="ss-card p-8 space-y-6 text-slate-300 leading-relaxed text-sm">
                <p>
                    Welcome to SmartShop. By accessing or using our website and voice services, you agree to be bound by these Terms of Service.
                </p>

                <h3 className="text-white font-bold text-base mt-6 fontFamily-space uppercase tracking-wider">1. Use of Services</h3>
                <p>
                    You agree to use SmartShop only for lawful purposes. You must not use our platform to transmit any harmful code, interfere with our operations, or attempt to access restricted areas.
                </p>

                <h3 className="text-white font-bold text-base mt-6 fontFamily-space uppercase tracking-wider">2. Account Responsibility</h3>
                <p>
                    You are responsible for maintaining the confidentiality of your account credentials. You agree to accept responsibility for all activities that occur under your account.
                </p>

                <h3 className="text-white font-bold text-base mt-6 fontFamily-space uppercase tracking-wider">3. Product Descriptions</h3>
                <p>
                    We strive to be as accurate as possible. However, SmartShop does not warrant that product descriptions or other content are error-free. If a product offered is not as described, your sole remedy is to return it in unused condition.
                </p>

                <h3 className="text-white font-bold text-base mt-6 fontFamily-space uppercase tracking-wider">4. Voice AI Limitations</h3>
                <p>
                    Our AI assistant is designed to help you find products. While sophisticated, it may occasionally misinterpret commands. SmartShop is not liable for unintended orders resulting from unclear voice commands, though we will assist in rectifying genuine errors.
                </p>

                <h3 className="text-white font-bold text-base mt-6 fontFamily-space uppercase tracking-wider">5. Governing Law</h3>
                <p>
                    These terms shall be governed by and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions.
                </p>
            </div>
        </div>
    );
};

export default TermsPage;
