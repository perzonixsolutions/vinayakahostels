import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import AuthService from '@/integrations/AuthService';

const API_URL = 'http://localhost:5001/api';

export default function AdminStudentsPage() {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const statusFilter = searchParams.get('status');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStudents();
    }, [statusFilter]);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/students`, {
                params: { status: statusFilter },
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.room_number && student.room_number.includes(searchTerm))
    );

    const getTitle = () => {
        if (statusFilter === 'due') return 'Students with Rent Due';
        if (statusFilter === 'paid') return 'Students with Rent Paid';
        return 'All Students';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="font-heading text-3xl text-foreground">{getTitle()}</h1>
                <Link to="/admin/students/add">
                    <Button className="bg-primary text-white hover:bg-primary/90">
                        <PlusCircle size={18} className="mr-2" />
                        Add Student
                    </Button>
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-muted-grey flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or room..."
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-muted-grey overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-700">Name</th>
                                <th className="px-6 py-4 font-medium text-gray-700">Room</th>
                                <th className="px-6 py-4 font-medium text-gray-700">Contact</th>
                                <th className="px-6 py-4 font-medium text-gray-700">Rent Status</th>
                                <th className="px-6 py-4 font-medium text-gray-700">Joined Date</th>
                                <th className="px-6 py-4 font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading students...</td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No students found.</td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{student.name}</div>
                                            <div className="text-gray-500 text-xs">{student.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.room_number ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {student.block_name} - {student.room_number}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{student.phone}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500">
                                                    Total: ₹{student.fee_total} <span className="text-gray-400">({student.rent_cycle || 'Monthly'})</span>
                                                </span>
                                                {student.fee_due > 0 ? (
                                                    <span className="text-red-600 font-medium">Due: ₹{student.fee_due}</span>
                                                ) : (
                                                    <span className="text-green-600 font-medium">Paid</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(student.join_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button variant="ghost" size="sm" className="text-blue-600">Edit</Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
