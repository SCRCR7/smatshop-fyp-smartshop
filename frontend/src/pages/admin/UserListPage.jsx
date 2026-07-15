import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Users,
    Edit,
    Trash2,
    ShieldCheck,
    ShieldAlert,
    Mail,
    Calendar,
    Loader2,
    Search,
    Clock
} from 'lucide-react';

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('vstore_token');
            const { data } = await axios.get('/api/v1/auth/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(data.users);
            setFilteredUsers(data.users);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const results = users.filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u._id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);

    const deleteHandler = async (id) => {
        if (window.confirm('Delete user account permanently?')) {
            try {
                await axios.delete(`/api/v1/auth/users/${id}`);
                fetchUsers();
            } catch (err) {
                alert(err.response?.data?.message || 'Delete failed');
            }
        }
    };

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-brand-orange" size={48} /></div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex justify-between items-center">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-sm text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-brand-orange/20 outline-none w-64"
                    />
                </div>
                <div className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                    Total Active Users: <span className="text-brand-navy">{users.length}</span>
                </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 italic">
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">User Object</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Email Address</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Protocol (Role)</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-brand-navy rounded-sm flex items-center justify-center text-white font-black text-xs italic shadow-md">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-brand-navy uppercase tracking-tighter truncate max-w-[150px]">{user.name}</p>
                                            <p className="text-[9px] font-black text-gray-300 uppercase italic">ID: #{user._id.slice(-6)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                                        <Mail size={12} className="text-gray-300" /> {user.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center">
                                        {user.role === 'admin' ? (
                                            <div className="flex items-center gap-1 text-[9px] font-black uppercase text-brand-orange bg-orange-50 px-3 py-1 rounded-sm border border-orange-100 shadow-sm tracking-widest">
                                                <ShieldCheck size={12} /> Root Admin
                                            </div>
                                        ) : user.role === 'seller' ? (
                                            <div className="flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-sm border border-emerald-200 shadow-sm tracking-widest">
                                                <ShieldCheck size={12} /> Seller
                                            </div>
                                        ) : user.role === 'seller_pending' ? (
                                            <div className="flex items-center gap-1 text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-3 py-1 rounded-sm border border-amber-200 shadow-sm tracking-widest">
                                                <Clock size={12} /> Pending Seller
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-[9px] font-black uppercase text-gray-400 bg-gray-50 px-3 py-1 rounded-sm border border-gray-100 italic tracking-widest">
                                                Standard User
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link to={`/admin/users/${user._id}/edit`}>
                                            <button className="p-2 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 rounded-sm text-gray-400 hover:text-brand-orange transition-all">
                                                <Edit size={16} />
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => deleteHandler(user._id)}
                                            className="p-2 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 rounded-sm text-gray-400 hover:text-red-500 transition-all font-black"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserListPage;
