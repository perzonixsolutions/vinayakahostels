import { useState, useEffect } from 'react';
import axios from 'axios';
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
            const response = await axios.get(`${API_URL}/dashboard/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
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
                    title="This Month Revenue"
                    value={`₹${stats.revenue.toLocaleString()}`}
                    subtext="Rent collected"
                    icon={IndianRupee}
                    color="bg-emerald-600"
                />
                <StatCard
                    title="Pending Fees"
                    value={`₹${stats.pendingFees.toLocaleString()}`}
                    subtext="Money not yet paid"
                    icon={AlertCircle}
                    color="bg-orange-500"
                />
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
