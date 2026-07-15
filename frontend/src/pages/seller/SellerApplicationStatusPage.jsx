import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const SellerApplicationStatusPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplicationStatus = async () => {
            try {
                const token = localStorage.getItem('vstore_token');
                const response = await axios.get(
                    '/api/v1/seller-applications/status',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    setStatus(response.data);
                }
            } catch (err) {
                console.error('Failed to fetch application status:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationStatus();
    }, []);

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading application status...</p>
                </div>
            </div>
        );
    }

    if (!status) {
        return (
            <div className="w-full min-h-screen bg-white flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-black text-brand-navy mb-2">Error Loading Status</h1>
                    <p className="text-gray-600 mb-6">Unable to load your application status. Please try again.</p>
                    <button
                        onClick={() => navigate('/seller')}
                        className="h-12 px-8 bg-brand-orange hover:bg-orange-600 text-white font-black text-sm uppercase tracking-[0.15em] rounded-sm transition-all"
                    >
                        Back to Seller Page
                    </button>
                </div>
            </div>
        );
    }

    const statusVariants = {
        pending: {
            icon: Clock,
            title: 'Application Under Review',
            description: 'Your seller application is being reviewed by our team. We typically respond within 24-48 hours.',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            iconColor: 'text-blue-600',
            textColor: 'text-blue-800',
            badge: 'pending',
            badgeColor: 'bg-blue-100 text-blue-700'
        },
        approved: {
            icon: CheckCircle2,
            title: 'Application Approved!',
            description: 'Congratulations! You have been approved as a SmartShop seller. You can now access your seller dashboard and start listing products.',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            iconColor: 'text-green-600',
            textColor: 'text-green-800',
            badge: 'approved',
            badgeColor: 'bg-green-100 text-green-700',
            showDashboardBtn: true
        },
        rejected: {
            icon: XCircle,
            title: 'Application Not Approved',
            description: 'Unfortunately, your seller application has been reviewed and not approved at this time.',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            iconColor: 'text-red-600',
            textColor: 'text-red-800',
            badge: 'rejected',
            badgeColor: 'bg-red-100 text-red-700',
            showReapplyBtn: true
        },
        not_applied: {
            icon: AlertCircle,
            title: 'No Active Application',
            description: 'You have not submitted a seller application yet. Click below to get started.',
            bgColor: 'bg-gray-50',
            borderColor: 'border-gray-200',
            iconColor: 'text-gray-600',
            textColor: 'text-gray-800',
            badge: 'not_applied',
            badgeColor: 'bg-gray-100 text-gray-700',
            showApplyBtn: true
        }
    };

    const currentStatus = statusVariants[status.sellerApplicationStatus] || statusVariants.not_applied;
    const StatusIcon = currentStatus.icon;

    const handleReapply = async () => {
        if (window.confirm('Are you sure you want to reapply to become a seller?')) {
            try {
                const token = localStorage.getItem('vstore_token');
                const response = await axios.post(
                    '/api/v1/seller-applications/reapply',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    setStatus({
                        ...status,
                        sellerApplicationStatus: 'pending',
                        sellerApplicationDate: new Date()
                    });
                    alert('Your application has been resubmitted successfully!');
                }
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to reapply. Please try again.');
            }
        }
    };

    return (
        <div className="w-full bg-white">
            {/* Header */}
            <div className="bg-brand-navy text-white py-12 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-black italic uppercase mb-2">
                        Seller Application Status
                    </h1>
                    <p className="text-gray-300">
                        Tracking your seller application
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                {/* Status Card */}
                <div className={`${currentStatus.bgColor} border ${currentStatus.borderColor} rounded-lg p-8 mb-10`}>
                    <div className="flex gap-6 items-start">
                        <StatusIcon className={`${currentStatus.iconColor} w-12 h-12 flex-shrink-0`} />
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <h2 className={`text-3xl font-black uppercase ${currentStatus.textColor}`}>
                                    {currentStatus.title}
                                </h2>
                                <span className={`${currentStatus.badgeColor} px-3 py-1 rounded-full text-xs font-bold uppercase`}>
                                    {status.sellerApplicationStatus}
                                </span>
                            </div>
                            <p className={`${currentStatus.textColor} text-lg leading-relaxed`}>
                                {currentStatus.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {/* User Info */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-sm font-bold uppercase text-brand-navy mb-4 tracking-[0.1em]">
                            Your Information
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-600 uppercase font-bold">Name</p>
                                <p className="text-gray-800 font-semibold">{user?.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 uppercase font-bold">Email</p>
                                <p className="text-gray-800 font-semibold">{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 uppercase font-bold">Current Role</p>
                                <p className="text-gray-800 font-semibold capitalize">{status.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Info */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-sm font-bold uppercase text-brand-navy mb-4 tracking-[0.1em]">
                            Important Dates
                        </h3>
                        <div className="space-y-3">
                            {status.sellerApplicationDate && (
                                <div>
                                    <p className="text-xs text-gray-600 uppercase font-bold">Application Date</p>
                                    <p className="text-gray-800 font-semibold">
                                        {new Date(status.sellerApplicationDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            )}
                            {status.sellerApprovedDate && (
                                <div>
                                    <p className="text-xs text-gray-600 uppercase font-bold">Approval Date</p>
                                    <p className="text-gray-800 font-semibold">
                                        {new Date(status.sellerApprovedDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            )}
                            {status.sellerRejectionReason && (
                                <div>
                                    <p className="text-xs text-gray-600 uppercase font-bold">Rejection Reason</p>
                                    <p className="text-red-700 font-semibold">{status.sellerRejectionReason}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 flex-wrap mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="h-12 px-8 bg-gray-300 hover:bg-gray-400 text-white font-black text-sm uppercase tracking-[0.15em] rounded-sm transition-all active:scale-95"
                    >
                        Back to Home
                    </button>

                    {currentStatus.showDashboardBtn && (
                        <button
                            onClick={() => navigate('/seller/dashboard')}
                            className="h-12 px-8 bg-brand-orange hover:bg-orange-600 text-white font-black text-sm uppercase tracking-[0.15em] rounded-sm transition-all active:scale-95"
                        >
                            Go to Seller Dashboard
                        </button>
                    )}

                    {currentStatus.showReapplyBtn && (
                        <button
                            onClick={handleReapply}
                            className="h-12 px-8 bg-brand-orange hover:bg-orange-600 text-white font-black text-sm uppercase tracking-[0.15em] rounded-sm transition-all active:scale-95"
                        >
                            Reapply
                        </button>
                    )}

                    {currentStatus.showApplyBtn && (
                        <button
                            onClick={() => navigate('/seller/terms')}
                            className="h-12 px-8 bg-brand-orange hover:bg-orange-600 text-white font-black text-sm uppercase tracking-[0.15em] rounded-sm transition-all active:scale-95"
                        >
                            Apply Now
                        </button>
                    )}
                </div>

                {/* Info Box */}
                <div className="bg-brand-navy/5 border border-brand-navy/20 p-6 rounded-lg">
                    <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-brand-navy flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-brand-navy mb-1">Need Help?</p>
                            <p className="text-gray-700 text-sm">
                                If you have questions about your application status or need assistance, please contact our seller support team at support@smartshop.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerApplicationStatusPage;
