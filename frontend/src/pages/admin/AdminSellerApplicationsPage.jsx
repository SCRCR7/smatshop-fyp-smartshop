import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle2, XCircle, Clock, AlertCircle, Search } from 'lucide-react';
import axios from 'axios';

const AdminSellerApplicationsPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedApp, setSelectedApp] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('vstore_token');
            const response = await axios.get(
                '/api/v1/seller-applications',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setApplications(response.data.applications);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load applications');
            console.error('Error fetching applications:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        if (window.confirm('Are you sure you want to approve this seller?')) {
            setActionLoading(true);
            try {
                const token = localStorage.getItem('vstore_token');
                const response = await axios.put(
                    `/api/v1/seller-applications/${userId}/approve`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    // Remove from pending applications
                    setApplications(applications.filter(app => app._id !== userId));
                    // Close modal
                    setSelectedApp(null);
                    setRejectionReason('');
                    // Show success message
                    alert(`✓ ${response.data.message}\n\nUser role updated to SELLER in the system.`);
                }
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to approve seller');
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleReject = async (userId) => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        if (window.confirm('Are you sure you want to reject this seller?')) {
            setActionLoading(true);
            try {
                const token = localStorage.getItem('vstore_token');
                const response = await axios.put(
                    `/api/v1/seller-applications/${userId}/reject`,
                    { reason: rejectionReason },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    setApplications(applications.filter(app => app._id !== userId));
                    setRejectionReason('');
                    setSelectedApp(null);
                    alert(response.data.message);
                }
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to reject seller');
            } finally {
                setActionLoading(false);
            }
        }
    };

    const filteredApplications = applications.filter((app) =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading seller applications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-brand-navy text-white py-8 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-black italic uppercase mb-2">
                        Seller Applications
                    </h1>
                    <p className="text-gray-300">
                        Review and approve/reject seller applications
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-6 flex gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={fetchApplications}
                        className="px-6 py-2 bg-brand-navy hover:bg-black text-white font-bold rounded-lg transition-all"
                    >
                        Refresh
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <p className="text-gray-600 text-sm font-bold uppercase">Pending Applications</p>
                        <p className="text-4xl font-black text-brand-navy mt-2">{applications.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <p className="text-gray-600 text-sm font-bold uppercase">Application Status</p>
                        <p className="text-lg font-bold text-brand-orange mt-2">
                            {applications.length === 0 ? 'All Reviewed ✓' : 'Under Review'}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <p className="text-gray-600 text-sm font-bold uppercase">Last Updated</p>
                        <p className="text-lg font-bold text-brand-navy mt-2">
                            {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Applications Grid */}
                {filteredApplications.length === 0 ? (
                    <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
                        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No Pending Applications</h3>
                        <p className="text-gray-500">All seller applications have been reviewed.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredApplications.map((app) => (
                            <div key={app._id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-brand-navy to-brand-navy/80 text-white p-4">
                                    <p className="text-xs font-bold uppercase text-gray-300">Seller Application</p>
                                    <h3 className="text-lg font-black uppercase mt-1">{app.name}</h3>
                                </div>

                                {/* Card Body */}
                                <div className="p-4 space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-600 uppercase font-bold">Email</p>
                                        <p className="text-gray-800 font-semibold truncate">{app.email}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-600 uppercase font-bold">Application Date</p>
                                        <p className="text-gray-800 font-semibold">
                                            {new Date(app.sellerApplicationDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-600 uppercase font-bold">Role Status</p>
                                        <p className="text-gray-800 font-semibold">
                                            <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-bold">
                                                {app.role === 'seller_pending' ? 'Pending Review' : app.role}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            onClick={() => setSelectedApp(app)}
                                            className="w-full py-2 px-4 bg-brand-navy hover:bg-black text-white font-bold text-sm rounded transition-all"
                                        >
                                            Review Application
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for Review */}
            {selectedApp && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
                        {/* Modal Header */}
                        <div className="bg-brand-navy text-white p-6">
                            <h2 className="text-2xl font-black uppercase">Review Application</h2>
                            <p className="text-gray-300 text-sm mt-1">{selectedApp.name}</p>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-xs text-gray-600 uppercase font-bold mb-1">Full Name</p>
                                <p className="text-gray-800 font-semibold">{selectedApp.name}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-600 uppercase font-bold mb-1">Email Address</p>
                                <p className="text-gray-800 font-semibold">{selectedApp.email}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-600 uppercase font-bold mb-1">Applied On</p>
                                <p className="text-gray-800 font-semibold">
                                    {new Date(selectedApp.sellerApplicationDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>

                            {/* Rejection Reason Input (for rejection) */}
                            <div>
                                <label className="text-xs text-gray-600 uppercase font-bold mb-2 block">
                                    Rejection Reason (if rejecting)
                                </label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Enter reason for rejection..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-none"
                                    rows="3"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3">
                            <button
                                onClick={() => {
                                    setSelectedApp(null);
                                    setRejectionReason('');
                                }}
                                className="flex-1 py-2 px-4 bg-gray-300 hover:bg-gray-400 text-white font-bold rounded transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReject(selectedApp._id)}
                                disabled={actionLoading}
                                className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded transition-all disabled:opacity-50"
                            >
                                {actionLoading ? 'Processing...' : 'Reject'}
                            </button>
                            <button
                                onClick={() => handleApprove(selectedApp._id)}
                                disabled={actionLoading}
                                className="flex-1 py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded transition-all disabled:opacity-50"
                            >
                                {actionLoading ? 'Processing...' : 'Approve'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSellerApplicationsPage;
