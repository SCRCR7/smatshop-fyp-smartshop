import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft,
    User,
    Mail,
    Shield,
    Save,
    Loader2,
    CheckCircle2,
    Key
} from 'lucide-react';

const UserEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'user'
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('vstore_token');
                const { data } = await axios.get(`/api/v1/auth/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFormData({
                    name: data.user.name,
                    email: data.user.email,
                    role: data.user.role
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const token = localStorage.getItem('vstore_token');
            await axios.put(`/api/v1/auth/users/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUpdateLoading(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
            setUpdateLoading(false);
        }
    };

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-brand-orange" size={48} /></div>;

    return (
        <div className="max-w-xl space-y-8">
            <Link to="/admin/users" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-orange transition-colors">
                <ArrowLeft size={16} /> Back to User Directory
            </Link>

            <div className="bg-white p-10 rounded-sm shadow-sm border border-gray-100 relative overflow-hidden">
                {success && (
                    <div className="absolute top-0 left-0 right-0 bg-green-500 text-white py-2 text-center text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top duration-300">
                        User Profile Updated Successfully
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2 text-center border-b border-gray-50 pb-6 mb-8">
                            <div className="w-16 h-16 bg-brand-navy text-white rounded-full mx-auto flex items-center justify-center text-3xl font-black italic shadow-xl">
                                {formData.name.charAt(0)}
                            </div>
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-brand-navy">{formData.name}</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identity Reconciliation</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <User size={12} /> Full Display Name
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full h-14 bg-gray-50 border-none rounded-sm px-6 text-sm font-black text-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-orange/20 transition-all outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <Mail size={12} /> Email Address
                                </label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full h-14 bg-gray-50 border-none rounded-sm px-6 text-sm font-bold text-gray-500 opacity-60 cursor-not-allowed outline-none"
                                    disabled
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <Shield size={12} /> Security Protocol (Role)
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full h-14 bg-gray-50 border-none rounded-sm px-6 text-[10px] font-black uppercase tracking-widest text-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-orange/20 transition-all outline-none appearance-none"
                                >
                                    <option value="buyer">Buyer</option>
                                    <option value="seller_pending">Seller Pending</option>
                                    <option value="seller">Seller</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                disabled={updateLoading}
                                type="submit"
                                className="w-full h-16 bg-brand-orange text-white font-black text-xs uppercase tracking-[0.3em] rounded-sm shadow-2xl hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {updateLoading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                {updateLoading ? 'Establishing Link...' : 'Synchronize Identity'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEditPage;
