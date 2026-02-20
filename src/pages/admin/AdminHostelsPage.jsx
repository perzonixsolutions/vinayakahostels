import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, Plus, ArrowRight, Trash2 } from 'lucide-react';
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

export default function AdminHostelsPage() {
    const [blocks, setBlocks] = useState([]);
    const [newBlockName, setNewBlockName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchBlocks();
    }, []);

    const fetchBlocks = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/hostels/blocks`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBlocks(response.data);
        } catch (error) {
            console.error('Error fetching blocks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteBlock = async (blockId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/hostels/blocks/${blockId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBlocks();
        } catch (error) {
            console.error('Error deleting block:', error);
            alert(error.response?.data?.message || 'Failed to delete block');
        }
    };

    const handleAddBlock = async (e) => {
        e.preventDefault();
        if (!newBlockName.trim()) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/hostels/blocks`, { name: newBlockName }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewBlockName('');
            setIsDialogOpen(false);
            fetchBlocks();
        } catch (error) {
            console.error('Error adding block:', error);
            alert('Failed to add block. It might already exist.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="font-heading text-3xl text-foreground">Hostel Blocks</h1>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary text-white hover:bg-primary/90">
                            <Plus size={18} className="mr-2" />
                            Add Block
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Block</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddBlock} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="blockName">Block Name</Label>
                                <Input
                                    id="blockName"
                                    value={newBlockName}
                                    onChange={(e) => setNewBlockName(e.target.value)}
                                    placeholder="e.g., Block A, Main Building"
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Adding...' : 'Add Block'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full text-center py-10 text-gray-500">Loading blocks...</div>
                ) : blocks.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                        No blocks found. Add one to get started.
                    </div>
                ) : (
                    blocks.map(block => (
                        <div key={block.id} className="group relative">
                            <Link to={`/admin/hostels/block/${block.id}`}>
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-muted-grey hover:shadow-md transition-shadow h-full">
                                    <div className="flex justify-between items-start">
                                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                                            <Building size={24} />
                                        </div>
                                        <ArrowRight size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
                                    </div>
                                    <h3 className="font-heading text-xl font-bold mt-4 mb-2 group-hover:text-primary transition-colors">
                                        {block.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Click to manage rooms and view occupancy.
                                    </p>
                                </div>
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (window.confirm(`Are you sure you want to delete ${block.name}? This action cannot be undone.`)) {
                                        handleDeleteBlock(block.id);
                                    }
                                }}
                                className="absolute top-4 right-12 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors z-10"
                                title="Delete Block"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
