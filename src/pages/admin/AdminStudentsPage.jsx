import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import AuthService from '@/integrations/AuthService';

const API_URL = import.meta.env.VITE_API_URL;

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

    const [editingStudent, setEditingStudent] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Room Assignment State
    const [blocks, setBlocks] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState('');

    // Initial state for edit form
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        phone: '',
        fee_total: '',
        fee_paid: '',
        room_id: ''
    });

    useEffect(() => {
        if (isEditOpen) {
            fetchBlocks();
        }
    }, [isEditOpen]);

    useEffect(() => {
        if (selectedBlock) {
            fetchRooms(selectedBlock);
        } else {
            setRooms([]);
        }
    }, [selectedBlock]);

    const fetchBlocks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/hostels/blocks`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBlocks(response.data);
        } catch (error) {
            console.error('Error fetching blocks:', error);
        }
    };

    const fetchRooms = async (blockId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/hostels/blocks/${blockId}/rooms`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Show all rooms, but mark full ones? Or just filter? 
            // For editing, we might want to see the current room even if full (though here we are re-assigning so maybe only free ones?)
            // Let's show all but disable full ones unless it's the current room.
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const handleEditClick = (student) => {
        setEditingStudent(student);
        setEditFormData({
            name: student.name,
            email: student.email || '',
            phone: student.phone || '',
            fee_total: student.fee_total,
            fee_paid: student.fee_paid,
            room_id: student.room_id || ''
        });
        // If student has a room, try to pre-select block
        // We need to know the block_id of the student's room. 
        // The student object has block_name, but maybe not block_id?
        // Let's check the API response for students. 
        // It has students.*, rooms.room_number, blocks.name as block_name.
        // It doesn't seem to have block_id. 
        // We might need to fetch blocks and find the one matching block_name or update student fetch to include block_id.
        // For now, let's just default to empty block and user has to re-select if they want to change room.
        // OR better: Update fetchStudents to return block_id.
        setSelectedBlock(''); // Reset for now.
        setIsEditOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/students/${editingStudent.id}`, {
                ...editFormData,
                rent_total: editFormData.fee_total, // Map back to backend expectation
                rent_paid: editFormData.fee_paid
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsEditOpen(false);
            fetchStudents();
        } catch (error) {
            console.error('Error updating student:', error);
            alert('Failed to update student');
        } finally {
            setIsUpdating(false);
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
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-blue-600"
                                                onClick={() => handleEditClick(student)}
                                            >
                                                Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Dialog */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Edit Student</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                    value={editFormData.email}
                                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                    value={editFormData.phone}
                                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Room Assignment Section */}
                            <div className="border-t border-b py-4 space-y-3">
                                <h3 className="font-medium text-sm text-gray-500">Room Reassignment</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Block</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                        value={selectedBlock}
                                        onChange={(e) => {
                                            setSelectedBlock(e.target.value);
                                            setEditFormData({ ...editFormData, room_id: '' }); // Reset room when block changes
                                        }}
                                    >
                                        <option value="">-- Select Block to Change Room --</option>
                                        {blocks.map(block => (
                                            <option key={block.id} value={block.id}>{block.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Room</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                        value={editFormData.room_id}
                                        onChange={(e) => setEditFormData({ ...editFormData, room_id: e.target.value })}
                                        disabled={!selectedBlock}
                                    >
                                        <option value="">-- Select Room --</option>
                                        {rooms.map(room => (
                                            <option
                                                key={room.id}
                                                value={room.id}
                                                disabled={room.current_occupancy >= room.capacity && room.id !== editingStudent?.room_id}
                                            >
                                                {room.room_number} ({room.type}) - {room.capacity - room.current_occupancy} beds left
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Total Fee</label>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                        value={editFormData.fee_total}
                                        onChange={(e) => setEditFormData({ ...editFormData, fee_total: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fee Paid</label>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                        value={editFormData.fee_paid}
                                        onChange={(e) => setEditFormData({ ...editFormData, fee_paid: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
