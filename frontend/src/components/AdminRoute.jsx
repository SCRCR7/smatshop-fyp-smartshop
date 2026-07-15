import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AlertCircle } from 'lucide-react';

const AdminRoute = () => {
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

    if (loading) return null;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated but not admin, show unauthorized message
    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="p-4 bg-red-50 rounded-full">
                            <AlertCircle size={48} className="text-red-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-brand-navy uppercase italic">Access Denied</h1>
                    <p className="text-gray-600 font-bold">
                        You do not have permission to access the admin panel. Only administrators can view this section.
                    </p>
                    <div className="flex gap-4 pt-4">
                        <a href="/" className="flex-1 bg-brand-orange text-white py-3 rounded-sm font-black uppercase text-sm hover:bg-orange-600 transition-all">
                            Return Home
                        </a>
                        <a href="/login" className="flex-1 border border-brand-navy text-brand-navy py-3 rounded-sm font-black uppercase text-sm hover:bg-gray-100 transition-all">
                            Login Again
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // User is admin, render admin routes
    return <Outlet />;
};

export default AdminRoute;
