import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentCancel = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 space-y-8 ss-card border border-white/5 relative overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ background: 'radial-gradient(circle, rgba(244, 63, 94, 0.1) 0%, transparent 60%)', position: 'absolute', inset: 0, zIndex: -1 }} />
      <XCircle size={80} className="text-[#f43f5e] mb-2 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse" />
      <h2 className="text-3xl font-bold text-white uppercase tracking-tight fontFamily-space">Payment Cancelled</h2>
      <p className="text-base text-slate-400 font-medium text-center max-w-xl leading-relaxed">
        Your payment session was cancelled or declined. Don't worry, your cart items are still saved. You can try checking out again or contact customer support.
      </p>
      <Link to="/cart" className="mt-6">
        <button className="bg-linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) bg-indigo-600 text-white px-10 py-4 font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-2xl hover:brightness-110 transition-all active:scale-95">
          Go to Cart
        </button>
      </Link>
    </div>
  );
};

export default PaymentCancel;
