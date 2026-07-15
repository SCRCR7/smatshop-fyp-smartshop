import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import axios from 'axios';

const AuthCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = params.get("token");
    const error = params.get("error");

    if (error) {
      navigate("/login?error=google_auth_failed");
      return;
    }

    if (token) {
      const fetchUserAndLogin = async () => {
        try {
          // Temporarily save token so axios interceptor automatically attaches it
          localStorage.setItem("vstore_token", token);
          
          // Request user profile details from /api/v1/auth/me
          const { data } = await axios.get('/api/v1/auth/me');
          
          if (data && data.success && data.data) {
            // Dispatch loginSuccess to populate Redux state and permanent localStorage
            dispatch(loginSuccess({ user: data.data, token }));
            
            // Redirect user based on role, matching LoginPage.jsx redirection
            navigate(data.data.role === 'admin' ? '/admin' : '/');
          } else {
            throw new Error("Invalid response schema from auth/me");
          }
        } catch (err) {
          console.error("Error during Google OAuth callback handling:", err);
          localStorage.removeItem("vstore_token");
          navigate("/login?error=google_auth_failed");
        }
      };

      fetchUserAndLogin();
    } else {
      navigate("/login");
    }
  }, [params, navigate, dispatch]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', fontFamily: 'Space Grotesk, sans-serif' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid #1a1a1a',
          borderTop: '3px solid #f57224',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ fontSize: 14, color: '#888' }}>Signing you in securely...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
