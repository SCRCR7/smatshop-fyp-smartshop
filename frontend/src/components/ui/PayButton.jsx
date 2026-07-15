import React from 'react';
import { CreditCard, Loader2 } from 'lucide-react';

const PayButton = ({ onClick, loading, buttonText = "Place Order" }) => {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            style={{ 
                width: '100%', 
                marginTop: 20, 
                height: 52, 
                background: loading ? 'rgba(255, 255, 255, 0.04)' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                color: loading ? 'var(--text-muted)' : '#fff', 
                border: loading ? '1px solid rgba(255, 255, 255, 0.05)' : 'none', 
                borderRadius: 12, 
                fontSize: 14, 
                fontWeight: 700, 
                cursor: loading ? 'not-allowed' : 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 8, 
                letterSpacing: '0.04em', 
                transition: 'all 0.25s ease',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(99, 102, 241, 0.25)'
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.filter = 'brightness(1.1)'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.filter = 'none'; }}
        >
            {loading ? (
                <>
                    <Loader2 size={18} className="animate-spin text-indigo-400" />
                    Processing...
                </>
            ) : (
                <>
                    <CreditCard size={16} />
                    {buttonText}
                </>
            )}
        </button>
    );
};

export default PayButton;

