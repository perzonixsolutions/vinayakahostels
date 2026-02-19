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

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminBlockDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blockName, setBlockName] = useState('');
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        // API_URL includes /api, but images are at root /uploads
        // Remove /api from the end of API_URL
        const baseUrl = API_URL.replace(/\/api$/, '');
        return `${baseUrl}${imagePath}`;
    };

    // List of common amenities to help user
    const COMMON_AMENITIES = [
        "AC", "Wi-Fi", "Attached Bathroom", "Geyser", "Study Table", "Wardrobe", "Balcony"
    ];

    // Form State
    const [newRoom, setNewRoom] = useState({
        room_number: '',
        capacity: 3,
        type: 'Non-AC',
        name: '',
        price_monthly: '',
        price_semester: '',
        image: null,
        description: '',
        amenities: '',
        is_visible: true
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
            const formData = new FormData();
            formData.append('block_id', id);
            formData.append('room_number', newRoom.room_number);
            formData.append('capacity', newRoom.capacity);
            formData.append('type', newRoom.type);
            formData.append('name', newRoom.name);
            formData.append('description', newRoom.description);
            formData.append('amenities', newRoom.amenities);
            formData.append('is_visible', newRoom.is_visible);

            if (newRoom.price_monthly) formData.append('price_monthly', newRoom.price_monthly);
            if (newRoom.price_semester) formData.append('price_semester', newRoom.price_semester);
            if (newRoom.image) formData.append('image', newRoom.image);

            await axios.post(`${API_URL}/hostels/rooms`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setNewRoom({
                room_number: '',
                capacity: 3,
                type: 'Non-AC',
                name: '',
                price_monthly: '',
                price_semester: '',
                image: null,
                description: '',
                amenities: '',
                is_visible: true
            });
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
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Room</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddRoom} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="room_number">Room Number *</Label>
                                    <Input
                                        id="room_number"
                                        value={newRoom.room_number}
                                        onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })}
                                        placeholder="e.g. 101"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Room Name/Title (Public)</Label>
                                    <Input
                                        id="name"
                                        value={newRoom.name}
                                        onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                                        placeholder="e.g. Premium Single Room"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="capacity">Capacity *</Label>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        min="1"
                                        value={newRoom.capacity}
                                        onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Room Type *</Label>
                                    <select
                                        id="type"
                                        className="w-full p-2 border rounded-md"
                                        value={newRoom.type}
                                        onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                                    >
                                        <option value="Non-AC">Non-AC</option>
                                        <option value="AC">AC</option>
                                        <option value="Special">Special</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price_monthly">Monthly Rent (₹)</Label>
                                    <Input
                                        id="price_monthly"
                                        type="number"
                                        value={newRoom.price_monthly}
                                        onChange={(e) => setNewRoom({ ...newRoom, price_monthly: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price_semester">Semester Rent (₹)</Label>
                                    <Input
                                        id="price_semester"
                                        type="number"
                                        value={newRoom.price_semester}
                                        onChange={(e) => setNewRoom({ ...newRoom, price_semester: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Room Image</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setNewRoom({ ...newRoom, image: e.target.files[0] })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={newRoom.description}
                                    onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                                    placeholder="Detailed description of the room..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amenities">Amenities (Comma separated)</Label>
                                <Input
                                    id="amenities"
                                    value={newRoom.amenities}
                                    onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
                                    placeholder="Wi-Fi, AC, Attached Bathroom..."
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    Common: {COMMON_AMENITIES.join(', ')}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_visible"
                                    checked={newRoom.is_visible}
                                    onChange={(e) => setNewRoom({ ...newRoom, is_visible: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="is_visible" className="cursor-pointer">Show on Public Website</Label>
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
                            <div>
                                <h3 className="font-bold text-lg">{room.room_number}</h3>
                                {room.name && <p className="text-xs text-gray-500 truncate max-w-[150px]">{room.name}</p>}
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600 mb-1">{room.type}</span>
                                {room.is_visible ? (
                                    <span className="text-[10px] text-green-600 bg-green-50 px-1 rounded border border-green-200">Public</span>
                                ) : (
                                    <span className="text-[10px] text-gray-400 bg-gray-50 px-1 rounded border border-gray-200">Hidden</span>
                                )}
                            </div>
                        </div>

                        {room.image_url && (
                            <div className="mb-3 w-full h-32 rounded-md overflow-hidden bg-gray-100">
                                <img
                                    src={getImageUrl(room.image_url)}
                                    alt={room.room_number}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                    }}
                                />
                            </div>
                        )}

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
