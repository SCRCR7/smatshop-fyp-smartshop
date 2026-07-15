import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const SellerTermsPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleApply = async () => {
        if (!termsAccepted) {
            setError('You must accept the terms and conditions to proceed');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('vstore_token');
            const response = await axios.post(
                '/api/v1/seller-applications/apply',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                // Redirect to application status page
                navigate('/seller/application-status', { 
                    replace: true,
                    state: { message: 'Application submitted successfully!' }
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
            console.error('Application error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-white">
            {/* Header */}
            <div className="bg-brand-navy text-white py-12 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-black italic uppercase mb-3">
                        Seller Terms & Conditions
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Please read and accept these terms to proceed with your seller application
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                {/* Alert */}
                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Terms Section */}
                <div className="space-y-8 mb-10">
                    {/* Term 1 */}
                    <div className="border-l-4 border-brand-orange pl-6">
                        <h2 className="text-2xl font-black text-brand-navy uppercase mb-2">
                            1. Accurate Product Information
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-3">
                            All product listings must contain accurate, honest, and complete information. This includes:
                        </p>
                        <ul className="space-y-2 ml-4 text-gray-700">
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Genuine product descriptions and specifications</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Real and unaltered product images</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Correct pricing and availability information</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>All applicable product details (size, color, material, etc.)</span>
                            </li>
                        </ul>
                    </div>

                    {/* Term 2 */}
                    <div className="border-l-4 border-brand-orange pl-6">
                        <h2 className="text-2xl font-black text-brand-navy uppercase mb-2">
                            2. Prohibited Content
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-3">
                            The following are strictly prohibited:
                        </p>
                        <ul className="space-y-2 ml-4 text-gray-700">
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Counterfeit, stolen, or fraudulent products</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Misleading titles or descriptions designed to deceive</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Illegal, dangerous, or harmful items</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Duplicate listings with different variations</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>External contact information or payment methods</span>
                            </li>
                        </ul>
                    </div>

                    {/* Term 3 */}
                    <div className="border-l-4 border-brand-orange pl-6">
                        <h2 className="text-2xl font-black text-brand-navy uppercase mb-2">
                            3. Quality & Service Standards
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            As a SmartShop seller, you agree to maintain high standards of customer service:
                        </p>
                        <ul className="space-y-2 ml-4 mt-3 text-gray-700">
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Respond to customer inquiries within 24 hours</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Ship orders within the promised timeframe</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Handle returns and refunds professionally</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Maintain a positive seller rating</span>
                            </li>
                        </ul>
                    </div>

                    {/* Term 4 */}
                    <div className="border-l-4 border-brand-orange pl-6">
                        <h2 className="text-2xl font-black text-brand-navy uppercase mb-2">
                            4. Commission & Fees
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            SmartShop charges a competitive commission on each successful sale. You agree to:
                        </p>
                        <ul className="space-y-2 ml-4 mt-3 text-gray-700">
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Pay applicable platform fees and commissions</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Cover shipping and packaging costs</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Comply with all tax obligations</span>
                            </li>
                        </ul>
                    </div>

                    {/* Term 5 */}
                    <div className="border-l-4 border-brand-orange pl-6">
                        <h2 className="text-2xl font-black text-brand-navy uppercase mb-2">
                            5. Account Suspension & Termination
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            SmartShop reserves the right to:
                        </p>
                        <ul className="space-y-2 ml-4 mt-3 text-gray-700">
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Suspend or terminate your seller account if you violate these terms</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Remove listings that violate platform policies</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Withhold payments if fraudulent activity is detected</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Take legal action if necessary</span>
                            </li>
                        </ul>
                    </div>

                    {/* Term 6 */}
                    <div className="border-l-4 border-brand-orange pl-6">
                        <h2 className="text-2xl font-black text-brand-navy uppercase mb-2">
                            6. Intellectual Property
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            You must have the right to sell all products listed on SmartShop. You agree that:
                        </p>
                        <ul className="space-y-2 ml-4 mt-3 text-gray-700">
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>You own or have permission to use all product images and descriptions</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>You will not infringe on copyrights, trademarks, or patents</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>SmartShop has the right to use your data for platform analytics</span>
                            </li>
                        </ul>
                    </div>

                    {/* Term 7 */}
                    <div className="border-l-4 border-brand-orange pl-6">
                        <h2 className="text-2xl font-black text-brand-navy uppercase mb-2">
                            7. Compliance & Legal
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            You agree to comply with all applicable laws and regulations, including:
                        </p>
                        <ul className="space-y-2 ml-4 mt-3 text-gray-700">
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Consumer protection laws and regulations</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Tax and business regulations</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-orange font-bold">•</span>
                                <span>Data protection and privacy laws</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Checkbox */}
                <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => {
                                setTermsAccepted(e.target.checked);
                                if (e.target.checked) setError('');
                            }}
                            className="w-5 h-5 text-brand-orange rounded cursor-pointer mt-1"
                        />
                        <span className="text-gray-700 leading-relaxed">
                            I have read and agree to all the Terms & Conditions above. I understand that by becoming a SmartShop seller, I commit to maintaining high standards of product quality, customer service, and compliance with all platform policies.
                        </span>
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => navigate('/seller')}
                        className="h-12 px-8 bg-gray-300 hover:bg-gray-400 text-white font-black text-sm uppercase tracking-[0.15em] rounded-sm transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        disabled={loading || !termsAccepted}
                        className={`h-12 px-8 font-black text-sm uppercase tracking-[0.15em] rounded-sm transition-all active:scale-95 ${
                            loading || !termsAccepted
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-brand-orange hover:bg-orange-600 text-white'
                        }`}
                    >
                        {loading ? 'Submitting...' : 'Apply to Become Seller'}
                    </button>
                </div>

                {/* Info Box */}
                <div className="bg-brand-navy/5 border border-brand-navy/20 p-6 rounded-lg">
                    <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-brand-navy mb-1">What happens next?</p>
                            <p className="text-gray-700 text-sm">
                                After you submit your application, our team will review it within 24-48 hours. You'll receive an email notification about the approval status. If approved, you'll immediately gain access to your seller dashboard to start listing products!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerTermsPage;
