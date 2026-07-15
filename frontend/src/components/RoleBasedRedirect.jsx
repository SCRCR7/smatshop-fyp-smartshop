import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Component that automatically redirects users based on their role after successful login.
 * Admins → /admin
 * Users → /
 */
const RoleBasedRedirect = ({ onRoleDetected }) => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && user) {
            if (onRoleDetected) {
                onRoleDetected(user.role);
            }

            // Redirect based on role
            if (user.role === 'admin') {
                navigate('/admin', { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate, onRoleDetected]);

    return null; // This component only handles redirect logic
};

export default RoleBasedRedirect;
