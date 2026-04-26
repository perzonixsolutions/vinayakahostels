import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
    Users,
    BedDouble,
    DoorOpen,
    IndianRupee,
    AlertCircle,
    CheckCircle2,
    XCircle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg border border-muted-grey shadow-sm">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold mt-2 text-foreground">{value}</h3>
                {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
            </div>
            <div className={`p-3 rounded-full ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
        </div>
    </div>
);

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalRooms: 0,
        totalBeds: 0,
        totalStudents: 0,
        bedsOccupied: 0,
        vacantBeds: 0,
        revenue: 0,
        pendingFees: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const [dashboardRes, contactRes] = await Promise.all([
                axios.get(`${API_URL}/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/contact/stats`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            setStats({
                ...dashboardRes.data,
                recentMessages: contactRes.data.recentMessages
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="font-heading text-3xl text-foreground">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Rooms"
                    value={stats.totalRooms}
                    subtext="Across all hostels"
                    icon={DoorOpen}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Beds"
                    value={stats.totalBeds}
                    subtext="Total Capacity"
                    icon={BedDouble}
                    color="bg-indigo-500"
                />
                <StatCard
                    title="Total Students"
                    value={stats.totalStudents}
                    subtext="Currently staying"
                    icon={Users}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Beds Occupied"
                    value={stats.bedsOccupied}
                    subtext="Filled beds"
                    icon={CheckCircle2}
                    color="bg-green-500"
                />
                <StatCard
                    title="Vacant Beds"
                    value={stats.vacantBeds}
                    subtext="Empty beds"
                    icon={XCircle}
                    color="bg-red-400"
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${(stats.revenue || 0).toLocaleString()}`}
                    subtext="All Income"
                    icon={IndianRupee}
                    color="bg-emerald-600"
                />
                <StatCard
                    title="Total Expenses"
                    value={`₹${(stats.totalExpenses || 0).toLocaleString()}`}
                    subtext="All Expenditures"
                    icon={AlertCircle}
                    color="bg-red-500"
                />
                <StatCard
                    title="Net Profit"
                    value={`₹${(stats.netProfit || 0).toLocaleString()}`}
                    subtext="Total Revenue - Total Expenses"
                    icon={CheckCircle2}
                    color="bg-green-600"
                />
                <StatCard
                    title="Pending Fees"
                    value={`₹${(stats.pendingFees || 0).toLocaleString()}`}
                    subtext="From active students"
                    icon={AlertCircle}
                    color="bg-orange-500"
                />
            </div>

            {/* Recent Messages Section */}
            <div className="bg-white rounded-lg border border-muted-grey shadow-sm overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-heading text-lg font-bold">Recent Messages</h2>
                    <Link to="/admin/messages" className="text-primary text-sm hover:underline">
                        View All
                    </Link>
                </div>
                <div className="divide-y divide-gray-100">
                    {stats.recentMessages && stats.recentMessages.length > 0 ? (
                        stats.recentMessages.map((msg) => (
                            <div key={msg.id} className="p-4 hover:bg-gray-50 flex justify-between items-center transition-colors">
                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center mb-1">
                                        <span className="font-medium text-gray-900 truncate">{msg.name}</span>
                                        {msg.status === 'new' && (
                                            <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-full">NEW</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">{msg.message}</p>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {msg.email} • {new Date(msg.submitted_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <Link to={`/admin/messages?id=${msg.id}`}>
                                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                                        View
                                    </Button>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            No recent messages.
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-muted-grey text-center py-20 mt-8">
                <h2 className="font-heading text-2xl text-foreground mb-4">Welcome back!</h2>
                <p className="font-paragraph text-lg text-foreground/60">
                    Use the sidebar to manage students, collect fees, and oversee hostel occupancy.
                </p>
            </div>
        </div>
    );
}
