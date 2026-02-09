import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Loader2, Trash2, RotateCcw, XCircle, CheckSquare, Square } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const currentStatus = searchParams.get('status') || 'new';

    // Bulk selection state
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        fetchMessages();
        setSelectedIds([]); // Clear selection when changing tabs
    }, [currentStatus]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5001/api/contact', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Client-side filtering based on status
            const allMessages = response.data;
            let filteredMessages = [];

            if (currentStatus === 'new') {
                filteredMessages = allMessages.filter(msg => msg.status === 'new');
            } else if (currentStatus === 'read') {
                filteredMessages = allMessages.filter(msg => msg.status === 'read' || msg.status === 'replied');
            } else if (currentStatus === 'deleted') {
                filteredMessages = allMessages.filter(msg => msg.status === 'deleted');
            } else {
                filteredMessages = allMessages.filter(msg => msg.status !== 'deleted');
            }

            setMessages(filteredMessages);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError('Failed to load messages');
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');

            if (newStatus === 'permanent_delete') {
                if (!window.confirm('Are you sure you want to permanently delete this message? This action cannot be undone.')) return;

                await axios.delete(`http://localhost:5001/api/contact/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.patch(`http://localhost:5001/api/contact/${id}`,
                    { status: newStatus },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            // Remove from current view
            setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
            setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));

        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status');
        }
    };

    // Bulk Actions Logic
    const toggleSelectAll = () => {
        if (selectedIds.length === messages.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(messages.map(msg => msg.id));
        }
    };

    const toggleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds(prev => [...prev, id]);
        }
    };

    const handleBulkAction = async (action) => {
        if (selectedIds.length === 0) return;

        if (action === 'permanent_delete') {
            if (!window.confirm(`Are you sure you want to permanently delete ${selectedIds.length} messages?`)) return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5001/api/contact/bulk-update',
                { ids: selectedIds, action },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Refresh list (simplest way to ensure correctness after bulk op)
            fetchMessages();
            setSelectedIds([]);

        } catch (err) {
            console.error('Error performing bulk action:', err);
            alert('Failed to perform bulk action');
        }
    };

    const getPageTitle = () => {
        switch (currentStatus) {
            case 'new': return 'New Messages';
            case 'read': return 'Read & Replied Messages';
            case 'deleted': return 'Recently Deleted';
            default: return 'Messages';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-8">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-heading font-medium text-foreground">{getPageTitle()}</h1>

                {/* Bulk Actions Bar */}
                {selectedIds.length > 0 && (
                    <div className="flex items-center space-x-2 bg-primary/5 px-4 py-2 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-top-2">
                        <span className="text-sm font-medium text-primary mr-2">{selectedIds.length} selected</span>

                        {(currentStatus === 'new' || currentStatus === 'read') && (
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleBulkAction('delete')}
                                className="h-8"
                            >
                                <Trash2 size={14} className="mr-1" /> Move to Trash
                            </Button>
                        )}

                        {currentStatus === 'deleted' && (
                            <>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleBulkAction('restore')}
                                    className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                    <RotateCcw size={14} className="mr-1" /> Restore
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleBulkAction('permanent_delete')}
                                    className="h-8"
                                >
                                    <XCircle size={14} className="mr-1" /> Delete Forever
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="rounded-md border border-muted-grey bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted-grey/20 text-foreground/70 font-display">
                            <tr>
                                <th className="px-6 py-4 w-12">
                                    <button
                                        onClick={toggleSelectAll}
                                        className="text-gray-500 hover:text-primary transition-colors"
                                    >
                                        {messages.length > 0 && selectedIds.length === messages.length ? (
                                            <CheckSquare size={20} />
                                        ) : (
                                            <Square size={20} />
                                        )}
                                    </button>
                                </th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Contact</th>
                                <th className="px-6 py-4 font-medium">Message</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-muted-grey/30">
                            {messages.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-foreground/50">
                                        No messages found in this category
                                    </td>
                                </tr>
                            ) : (
                                messages.map((msg) => (
                                    <tr key={msg.id} className={`hover:bg-muted-grey/5 transition-colors ${selectedIds.includes(msg.id) ? 'bg-primary/5' : ''}`}>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleSelectOne(msg.id)}
                                                className="text-gray-400 hover:text-primary transition-colors"
                                            >
                                                {selectedIds.includes(msg.id) ? (
                                                    <CheckSquare size={20} className="text-primary" />
                                                ) : (
                                                    <Square size={20} />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {format(new Date(msg.submitted_at), 'MMM d, yyyy')}
                                            <br />
                                            <span className="text-xs text-foreground/50">
                                                {format(new Date(msg.submitted_at), 'h:mm a')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            {msg.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-foreground">{msg.email}</span>
                                                <span className="text-foreground/60 text-xs">{msg.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate" title={msg.message}>
                                            {msg.message}
                                            {msg.preferred_date && (
                                                <div className="mt-1 text-xs text-primary font-medium">
                                                    Pref. Date: {msg.preferred_date}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${msg.status === 'new' ? 'bg-primary text-primary-foreground' :
                                                msg.status === 'replied' ? 'bg-green-100 text-green-800' :
                                                    msg.status === 'deleted' ? 'bg-red-100 text-red-800' :
                                                        'bg-secondary text-secondary-foreground'
                                                }`}>
                                                {msg.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            {currentStatus === 'new' && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleStatusUpdate(msg.id, 'read')}
                                                    >
                                                        Mark Read
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleStatusUpdate(msg.id, 'deleted')}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </>
                                            )}
                                            {currentStatus === 'read' && (
                                                <>
                                                    {msg.status === 'read' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-green-600 border-green-200 hover:bg-green-50"
                                                            onClick={() => handleStatusUpdate(msg.id, 'replied')}
                                                        >
                                                            Mark Replied
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleStatusUpdate(msg.id, 'deleted')}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </>
                                            )}
                                            {currentStatus === 'deleted' && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                        onClick={() => handleStatusUpdate(msg.id, 'restore')}
                                                    >
                                                        <RotateCcw size={16} className="mr-2" />
                                                        Restore
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                                                        onClick={() => handleStatusUpdate(msg.id, 'permanent_delete')}
                                                        title="Permanently Delete"
                                                    >
                                                        <XCircle size={16} />
                                                    </Button>
                                                </>
                                            )}
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
