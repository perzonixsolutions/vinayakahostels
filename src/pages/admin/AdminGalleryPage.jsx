import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminGalleryPage() {
    const [galleryItems, setGalleryItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newItem, setNewItem] = useState({
        category: 'Rooms',
        title: '',
        description: '',
        image: null,
        display_order: 0
    });

    const categories = ['Rooms', 'Common Areas', 'Dining', 'Exterior', 'Celebrations', 'Other'];

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/gallery`);
            setGalleryItems(res.data);
        } catch (error) {
            console.error('Error fetching gallery:', error);
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
            formData.append('category', newItem.category);
            formData.append('title', newItem.title);
            formData.append('description', newItem.description);
            formData.append('display_order', newItem.display_order);

            if (newItem.image) {
                formData.append('image', newItem.image);
            }

            await axios.post(`${API_URL}/gallery`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setNewItem({
                category: 'Rooms',
                title: '',
                description: '',
                image: null,
                display_order: 0
            });
            setIsDialogOpen(false);
            fetchGallery();
        } catch (error) {
            console.error('Error adding image:', error);
            alert('Failed to add image');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/gallery/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchGallery();
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        const baseUrl = API_URL.replace(/\/api$/, '');
        return `${baseUrl}${imagePath}`;
    };

    // Group items by category
    const groupedItems = categories.reduce((acc, cat) => {
        acc[cat] = galleryItems.filter(item => item.category === cat);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="font-heading text-3xl font-bold">Gallery Management</h1>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary text-white hover:bg-primary/90">
                            <Plus size={18} className="mr-2" />
                            Add Image
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add New Image</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <select
                                    id="category"
                                    className="w-full p-2 border rounded-md"
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={newItem.title}
                                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                    placeholder="e.g. Spacious Room"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={newItem.description}
                                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    placeholder="Brief description"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Image (Required)</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
                                    accept="image/*"
                                    required
                                />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Uploading...' : 'Upload'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-8">
                {categories.map(category => (
                    <div key={category} className="bg-white p-6 rounded-lg shadow-sm border border-muted-grey">
                        <h2 className="font-heading text-xl font-semibold mb-4 flex items-center text-primary">
                            <ImageIcon className="w-5 h-5 mr-2" />
                            {category}
                        </h2>

                        {!groupedItems[category] || groupedItems[category].length === 0 ? (
                            <p className="text-gray-500 italic text-sm">No images in this category.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {groupedItems[category].map(item => (
                                    <div key={item.id} className="border border-muted-grey rounded-md overflow-hidden group hover:shadow-md transition-shadow">
                                        <div className="relative aspect-video">
                                            <img
                                                src={getImageUrl(item.image)}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <Trash2 size={16} className="mr-2" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-medium truncate" title={item.title}>{item.title || 'Untitled'}</h3>
                                            <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
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
