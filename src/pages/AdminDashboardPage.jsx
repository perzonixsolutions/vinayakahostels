import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, AlertCircle, Bed } from 'lucide-react';

const API_URL = 'http://localhost:5001/api';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        feeDueCount: 0,
        availableBeds: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [studentStatsRes, hostelStatsRes] = await Promise.all([
                axios.get(`${API_URL}/students/stats`, { headers }),
                axios.get(`${API_URL}/hostels/stats`, { headers })
            ]);

            setStats({
                totalStudents: studentStatsRes.data.totalStudents,
                feeDueCount: studentStatsRes.data.feeDueCount,
                availableBeds: hostelStatsRes.data.availableBeds
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="font-heading text-3xl text-foreground">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-muted-grey flex items-start justify-between">
                    <div>
                        <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
                        <p className="text-3xl font-bold mt-2 text-primary">
                            {isLoading ? '...' : stats.totalStudents}
                        </p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Users size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-muted-grey flex items-start justify-between">
                    <div>
                        <h3 className="text-gray-500 text-sm font-medium">Rent Due</h3>
                        <p className={`text-3xl font-bold mt-2 ${stats.feeDueCount > 0 ? 'text-red-500' : 'text-gray-900'}`}>
                            {isLoading ? '...' : stats.feeDueCount}
                        </p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-full text-red-500">
                        <AlertCircle size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-muted-grey flex items-start justify-between">
                    <div>
                        <h3 className="text-gray-500 text-sm font-medium">Available Beds</h3>
                        <p className="text-3xl font-bold mt-2 text-green-600">
                            {isLoading ? '...' : stats.availableBeds}
                        </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-full text-green-600">
                        <Bed size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-muted-grey text-center py-20">
                <h2 className="font-heading text-2xl text-foreground mb-4">Welcome back!</h2>
                <p className="font-paragraph text-lg text-foreground/60">
                    Use the sidebar to manage students, collect fees, and oversee hostel occupancy.
                </p>
            </div>
        </div>
    );
}
