import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

const API_URL = 'http://localhost:5001/api';

export default function AdminAddStudentPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [blocks, setBlocks] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        aadhaar: '',
        parent_name: '',
        parent_phone: '',
        address: '',
        room_id: '',
        rent_total: '',
        rent_paid: '',
        rent_cycle: 'Monthly',
        join_date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchBlocks();
    }, []);

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
            setRooms(response.data.filter(r => r.current_occupancy < r.capacity));
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/students`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/admin/students');
        } catch (error) {
            console.error('Error adding student:', error);
            alert('Failed to add student. Please check the inputs.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => navigate(-1)} className="p-0 hover:bg-transparent">
                    <ArrowLeft size={24} />
                </Button>
                <h1 className="font-heading text-2xl font-bold">Add New Student</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-muted-grey">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="aadhaar">Aadhaar Number</Label>
                            <Input id="aadhaar" name="aadhaar" value={formData.aadhaar} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="join_date">Joining Date *</Label>
                            <Input id="join_date" name="join_date" type="date" value={formData.join_date} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Permanent Address</Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                    </div>

                    <hr className="border-gray-100" />

                    {/* Parent Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="parent_name">Parent/Guardian Name</Label>
                            <Input id="parent_name" name="parent_name" value={formData.parent_name} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="parent_phone">Parent Phone</Label>
                            <Input id="parent_phone" name="parent_phone" value={formData.parent_phone} onChange={handleChange} />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Room Assignment */}
                    <h3 className="font-medium text-lg">Room Assignment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Select Block</Label>
                            <select
                                className="w-full p-2 border rounded-md"
                                value={selectedBlock}
                                onChange={(e) => setSelectedBlock(e.target.value)}
                            >
                                <option value="">-- Select Block --</option>
                                {blocks.map(block => (
                                    <option key={block.id} value={block.id}>{block.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="room_id">Select Room</Label>
                            <select
                                id="room_id"
                                name="room_id"
                                className="w-full p-2 border rounded-md"
                                value={formData.room_id}
                                onChange={handleChange}
                                disabled={!selectedBlock}
                            >
                                <option value="">-- Select Room --</option>
                                {rooms.map(room => (
                                    <option key={room.id} value={room.id}>
                                        {room.room_number} ({room.type}) - {room.capacity - room.current_occupancy} beds left
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Rent Details */}
                    <h3 className="font-medium text-lg">Rent Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="rent_cycle">Rent Cycle</Label>
                            <select
                                id="rent_cycle"
                                name="rent_cycle"
                                className="w-full p-2 border rounded-md"
                                value={formData.rent_cycle}
                                onChange={handleChange}
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rent_total">Total Rent *</Label>
                            <Input id="rent_total" name="rent_total" type="number" value={formData.rent_total} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rent_paid">Rent Paid</Label>
                            <Input id="rent_paid" name="rent_paid" type="number" value={formData.rent_paid} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isLoading} className="bg-primary text-white">
                            {isLoading ? 'Saving...' : 'Save Student'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
