import React, { useEffect, useState } from 'react';
import {
    TrendingUp,
    Users,
    Package,
    ShoppingCart,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Loader2
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import axios from 'axios';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('vstore_token');
                const [statsRes, analyticsRes] = await Promise.all([
                    axios.get('/api/v1/orders/stats', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('/api/v1/orders/analytics', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setStats(statsRes.data.stats);
                setSalesData(analyticsRes.data.salesData.map(item => ({
                    name: item._id.split('-').slice(1).join('/'), // Format YYYY-MM-DD to MM/DD
                    sales: item.totalSales,
                    rawDate: item._id
                })));
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch dashboard data');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('SMARTSHOP ENTERPRISE REPORT', 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

        // Stats Table
        const statsRows = [
            ['Total Revenue', `PKR ${stats.totalRevenue.toLocaleString()}`],
            ['Active Orders', stats.activeOrders],
            ['Total Products', stats.totalProducts],
            ['Total Users', stats.totalUsers]
        ];

        doc.autoTable({
            startY: 40,
            head: [['Metric', 'Value']],
            body: statsRows,
            theme: 'grid',
            headStyles: { fillColor: [245, 114, 36] }
        });

        // Sales Table
        const salesRows = salesData.map(d => [d.rawDate, `PKR ${d.sales.toLocaleString()}`]);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 10,
            head: [['Date', 'Daily Sales']],
            body: salesRows,
            theme: 'striped',
            headStyles: { fillColor: [26, 32, 44] }
        });

        doc.save(`SmartShop_Report_${new Date().getTime()}.pdf`);
    };

    const kpiCards = stats ? [
        { label: 'Total Revenue', value: `Rs. ${stats.totalRevenue.toLocaleString()}`, change: '+12.5%', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50' },
        { label: 'Active Orders', value: stats.activeOrders, change: '+8.2%', icon: ShoppingCart, color: 'text-brand-orange', bg: 'bg-orange-50' },
        { label: 'Total Products', value: stats.totalProducts, change: '-2.4%', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Total Users', value: stats.totalUsers, change: '+15.1%', icon: Users, color: 'text-brand-navy', bg: 'bg-gray-100' },
    ] : [];

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-orange" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 space-y-4 hover:border-brand-orange/20 transition-all">
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-sm ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.change}
                                {stat.change.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                            <h3 className="text-2xl font-black text-brand-navy mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-sm shadow-sm border border-gray-100">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-tighter italic">Weekly Sales Trend</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Daily revenue performance</p>
                        </div>
                        <div className="flex gap-2 text-[9px] font-black uppercase">
                            <span className="flex items-center gap-1 text-brand-orange"><div className="w-2 h-2 bg-brand-orange rounded-full" /> Revenue</span>
                        </div>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f57224" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f57224" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#9ca3af' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#9ca3af' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '2px',
                                        border: 'none',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                        fontSize: '11px',
                                        fontWeight: 900,
                                        textTransform: 'uppercase'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#f57224"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-brand-navy text-white p-8 rounded-sm shadow-2xl border-b-8 border-brand-orange flex flex-col justify-between">
                    <div className="space-y-8">
                        <h3 className="text-lg font-black uppercase tracking-tighter italic border-b border-white/10 pb-4">Business Health</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <span>Total Fulfillment</span>
                                <span className="text-white">94%</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: '94%' }} />
                            </div>

                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <span>Voice Success</span>
                                <span className="text-white">99.8%</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-orange" style={{ width: '99.8%' }} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 mt-auto">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">Admin Control Center</p>
                        <button
                            onClick={generatePDF}
                            className="w-full py-4 bg-white/5 border border-white/10 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            Generate PDF Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
