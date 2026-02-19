import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Clock, Utensils } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminMenuPage() {
    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newItem, setNewItem] = useState({
        meal_type: 'Breakfast',
        name: '',
        description: '',
        price: '',
        image: null,
        day_of_week: 'Daily',
        is_available: true
    });

    const mealTypes = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
    const daysOfWeek = ['Daily', 'Weekdays', 'Weekends', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/menu`);
            setMenuItems(res.data);
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('meal_type', newItem.meal_type);
            formData.append('name', newItem.name);
            formData.append('description', newItem.description);
            formData.append('price', newItem.price);
            formData.append('day_of_week', newItem.day_of_week);
            formData.append('is_available', newItem.is_available);

            if (newItem.image) {
                formData.append('image', newItem.image);
            }

            await axios.post(`${API_URL}/menu`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setNewItem({
                meal_type: 'Breakfast',
                name: '',
                description: '',
                price: '',
                image: null,
                day_of_week: 'Daily',
                is_available: true
            });
            setIsDialogOpen(false);
            fetchMenu();
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Failed to add menu item');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/menu/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMenu();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const filterMeal = searchParams.get('meal');

    const filteredMealTypes = filterMeal && filterMeal !== 'all'
        ? mealTypes.filter(type => type === filterMeal)
        : mealTypes;

    const groupedMenu = filteredMealTypes.reduce((acc, type) => {
        acc[type] = menuItems.filter(item => item.meal_type === type);
        return acc;
    }, {});

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        // API_URL includes /api, but images are at root /uploads
        // Remove /api from the end of API_URL
        const baseUrl = API_URL.replace(/\/api$/, '');
        return `${baseUrl}${imagePath}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="font-heading text-3xl font-bold">Mess Menu Management</h1>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary text-white hover:bg-primary/90">
                            <Plus size={18} className="mr-2" />
                            Add Menu Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add New Menu Item</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="meal_type">Meal Type</Label>
                                <select
                                    id="meal_type"
                                    className="w-full p-2 border rounded-md"
                                    value={newItem.meal_type}
                                    onChange={(e) => setNewItem({ ...newItem, meal_type: e.target.value })}
                                >
                                    {mealTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Item Name</Label>
                                <Input
                                    id="name"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    required
                                    placeholder="e.g. Masala Dosa"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={newItem.description}
                                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    placeholder="Brief description of the dish"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="day_of_week">Served On</Label>
                                    <select
                                        id="day_of_week"
                                        className="w-full p-2 border rounded-md"
                                        value={newItem.day_of_week}
                                        onChange={(e) => setNewItem({ ...newItem, day_of_week: e.target.value })}
                                    >
                                        {daysOfWeek.map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="image">Image</Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Adding...' : 'Add Item'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-8">
                {filteredMealTypes.map(type => (
                    <div key={type} id={type.toLowerCase()} className="scroll-mt-6 bg-white p-6 rounded-lg shadow-sm border border-muted-grey">
                        <h2 className="font-heading text-xl font-semibold mb-4 flex items-center text-primary">
                            <Utensils className="w-5 h-5 mr-2" />
                            {type}
                        </h2>

                        {groupedMenu[type]?.length === 0 ? (
                            <p className="text-gray-500 italic text-sm">No items added to {type} yet to the menu.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {groupedMenu[type]?.map(item => (
                                    <div key={item.id} className="border border-muted-grey rounded-md p-4 flex gap-4 hover:shadow-md transition-shadow">
                                        {(item.image || item.image_url) && (
                                            <img
                                                src={getImageUrl(item.image || item.image_url)}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                                            <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit">
                                                <Clock size={12} className="mr-1" />
                                                {item.day_of_week}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
