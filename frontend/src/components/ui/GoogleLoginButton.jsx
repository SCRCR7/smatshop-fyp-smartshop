const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-2 border border-white/8 rounded-xl py-3 px-4 w-full bg-white/[0.02] text-slate-300 hover:bg-white/5 hover:text-white hover:border-accent-indigo/20 transition-all font-sans font-bold text-sm"
    >
      <img src="https://lh3.googleusercontent.com/COxitV7W2qqvNpFLDUR8sAHtRxVb1YgI3vJsCmkoFLDQaZsCmkoFLDQaZsCmkoFLDQaZs=s48" alt="" className="w-5 h-5" />
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;

