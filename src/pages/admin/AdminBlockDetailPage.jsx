import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Users, Bed, CreditCard } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";

const API_URL = 'http://localhost:5001/api';

export default function AdminBlockDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blockName, setBlockName] = useState('');
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [newRoom, setNewRoom] = useState({
        room_number: '',
        capacity: 3,
        type: 'Non-AC'
    });

    useEffect(() => {
        fetchBlockDetails();
    }, [id]);

    const fetchBlockDetails = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const blocksRes = await axios.get(`${API_URL}/hostels/blocks`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const block = blocksRes.data.find(b => b.id === parseInt(id));
            if (block) setBlockName(block.name);

            const roomsRes = await axios.get(`${API_URL}/hostels/blocks/${id}/rooms`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRooms(roomsRes.data);
        } catch (error) {
            console.error('Error fetching details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/hostels/rooms`, { ...newRoom, block_id: id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewRoom({ room_number: '', capacity: 3, type: 'Non-AC' });
            setIsDialogOpen(false);
            fetchBlockDetails();
        } catch (error) {
            console.error('Error adding room:', error);
            alert(error.response?.data?.message || 'Failed to add room.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => navigate('/admin/hostels')} className="p-0 hover:bg-transparent">
                    <ArrowLeft size={24} />
                </Button>
                <h1 className="font-heading text-2xl font-bold">{blockName || 'Loading...'}</h1>
            </div>

            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-muted-grey">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                        <Bed size={16} className="mr-2" />
                        <span>Total Rooms: {rooms.length}</span>
                    </div>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary text-white hover:bg-primary/90">
                            <Plus size={18} className="mr-2" />
                            Add Room
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Room</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddRoom} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="room_number">Room Number</Label>
                                    <Input
                                        id="room_number"
                                        value={newRoom.room_number}
                                        onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })}
                                        placeholder="e.g. 101"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="capacity">Capacity</Label>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        min="1"
                                        value={newRoom.capacity}
                                        onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Room Type</Label>
                                <select
                                    id="type"
                                    className="w-full p-2 border rounded-md"
                                    value={newRoom.type}
                                    onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                                >
                                    <option value="Non-AC">Non-AC</option>
                                    <option value="AC">AC</option>
                                </select>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Adding...' : 'Add Room'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {rooms.map(room => (
                    <div key={room.id} className={`p-4 rounded-lg border ${room.current_occupancy >= room.capacity
                            ? 'bg-red-50 border-red-200'
                            : 'bg-white border-muted-grey'
                        }`}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg">{room.room_number}</h3>
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{room.type}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-2">
                            <Users size={16} className="mr-2" />
                            <span>{room.current_occupancy} / {room.capacity} Occupied</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
                            <div
                                className={`h-1.5 rounded-full ${room.current_occupancy >= room.capacity ? 'bg-red-500' : 'bg-green-500'
                                    }`}
                                style={{ width: `${(room.current_occupancy / room.capacity) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
