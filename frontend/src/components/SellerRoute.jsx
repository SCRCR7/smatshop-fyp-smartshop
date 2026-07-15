import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * SellerRoute: Protects seller-specific routes
 * Only approved sellers (role === 'seller') can access seller dashboard and product pages
 */
const SellerRoute = () => {
    const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

    if (loading) return null;

    // Only allow users with 'seller' or 'admin' role
    if (isAuthenticated && (user?.role === 'seller' || user?.role === 'admin')) {
        return <Outlet />;
    }

    // Redirect to seller landing page if not an approved seller
    return <Navigate to="/seller" replace />;
};

export default SellerRoute;
