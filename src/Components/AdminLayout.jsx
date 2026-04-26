import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
    Users,
    Home,
    PlusCircle,
    CreditCard,
    AlertCircle,
    ChevronDown,
    ChevronRight,
    LogOut,
    Menu,
    X,
    MessageSquare,
    Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthService from '@/integrations/AuthService';
import axios from 'axios';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL;

// Helper for authorized requests
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [expandedMenus, setExpandedMenus] = useState({
        students: true,
        hostels: true,
        menu: true,
        messages: true
    });
    const [blocks, setBlocks] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!AuthService.isAuthenticated()) {
            navigate('/admin/login');
        } else {
            fetchBlocks();
            fetchUnreadMessages();
            // Poll for unread messages every minute
            const interval = setInterval(fetchUnreadMessages, 60000);
            return () => clearInterval(interval);
        }
    }, [navigate]);

    const fetchBlocks = async () => {
        try {
            const response = await axios.get(`${API_URL}/hostels/blocks`, {
                headers: getAuthHeader()
            });
            setBlocks(response.data);
        } catch (error) {
            console.error('Error fetching blocks:', error);
        }
    };

    const fetchUnreadMessages = async () => {
        try {
            const response = await axios.get(`${API_URL}/contact/stats`, {
                headers: getAuthHeader()
            });
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error('Error fetching message stats:', error);
        }
    };

    const toggleMenu = (menu) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    const handleLogout = () => {
        AuthService.logout();
        navigate('/admin/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:relative md:translate-x-0`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b flex justify-between items-center">
                        <Link to="/admin/dashboard" className="font-heading text-xl text-primary font-bold">
                            Vinayaka Admin
                        </Link>
                        <button
                            className="md:hidden text-gray-500"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                        {/* Dashboard */}
                        <Link
                            to="/admin/dashboard"
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/dashboard') ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Home size={20} />
                            <span className="font-medium">Dashboard</span>
                        </Link>

                        {/* Finance Section */}
                        <Link
                            to="/admin/finance"
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/finance') ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <CreditCard size={20} />
                            <span className="font-medium">Finance & Expenses</span>
                        </Link>

                        {/* Messages Section */}
                        <div>
                            <button
                                onClick={() => toggleMenu('messages')}
                                className="w-full flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <MessageSquare size={20} />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-medium">Messages</span>
                                </div>
                                {expandedMenus.messages ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>

                            {expandedMenus.messages && (
                                <div className="ml-4 pl-4 border-l-2 border-gray-100 space-y-1 mt-1">
                                    <Link
                                        to="/admin/messages?status=new"
                                        className={`block px-4 py-2 text-sm rounded-lg flex justify-between items-center ${location.search === '?status=new'
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        <span>New</span>
                                        {unreadCount > 0 && (
                                            <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </Link>
                                    <Link
                                        to="/admin/messages?status=read"
                                        className={`block px-4 py-2 text-sm rounded-lg ${location.search === '?status=read'
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        Read
                                    </Link>
                                    <Link
                                        to="/admin/messages?status=deleted"
                                        className={`block px-4 py-2 text-sm rounded-lg ${location.search === '?status=deleted'
                                            ? 'bg-red-50 text-red-600'
                                            : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        Recently Deleted
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mess Menu Section */}
                        <div>
                            <button
                                onClick={() => toggleMenu('menu')}
                                className="w-full flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <Menu size={20} />
                                    <span className="font-medium">Mess Menu</span>
                                </div>
                                {expandedMenus.menu ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>

                            {expandedMenus.menu && (
                                <div className="ml-4 pl-4 border-l-2 border-gray-100 space-y-1 mt-1">
                                    {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map(meal => (
                                        <Link
                                            key={meal}
                                            to={`/admin/menu?meal=${meal}`}
                                            className={`block px-4 py-2 text-sm rounded-lg ${location.search === `?meal=${meal}`
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-gray-500 hover:text-gray-900'
                                                }`}
                                        >
                                            {meal}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Students Section */}
                        <div>
                            <button
                                onClick={() => toggleMenu('students')}
                                className="w-full flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <Users size={20} />
                                    <span className="font-medium">Students</span>
                                </div>
                                {expandedMenus.students ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>

                            {expandedMenus.students && (
                                <div className="ml-4 pl-4 border-l-2 border-gray-100 space-y-1 mt-1">
                                    <Link
                                        to="/admin/students"
                                        className={`block px-4 py-2 text-sm rounded-lg ${isActive('/admin/students') && location.search === ''
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        Total Students
                                    </Link>
                                    <Link
                                        to="/admin/students?status=due"
                                        className={`block px-4 py-2 text-sm rounded-lg ${location.search === '?status=due'
                                            ? 'bg-red-50 text-red-600'
                                            : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        Rent Due
                                    </Link>
                                    <Link
                                        to="/admin/students?status=paid"
                                        className={`block px-4 py-2 text-sm rounded-lg ${location.search === '?status=paid'
                                            ? 'bg-green-50 text-green-600'
                                            : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        Rent Paid
                                    </Link>
                                    <Link
                                        to="/admin/students/add"
                                        className={`block px-4 py-2 text-sm rounded-lg ${isActive('/admin/students/add')
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        <span className="flex items-center">
                                            <PlusCircle size={14} className="mr-2" />
                                            Add Student
                                        </span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Hostels Section */}
                        <div>
                            <button
                                onClick={() => toggleMenu('hostels')}
                                className="w-full flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <Home size={20} />
                                    <span className="font-medium">Hostels</span>
                                </div>
                                {expandedMenus.hostels ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>

                            {expandedMenus.hostels && (
                                <div className="ml-4 pl-4 border-l-2 border-gray-100 space-y-1 mt-1">
                                    {blocks.map(block => (
                                        <Link
                                            key={block.id}
                                            to={`/admin/hostels/block/${block.id}`}
                                            className={`block px-4 py-2 text-sm rounded-lg ${isActive(`/admin/hostels/block/${block.id}`)
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-gray-500 hover:text-gray-900'
                                                }`}
                                        >
                                            {block.name}
                                        </Link>
                                    ))}
                                    <Link
                                        to="/admin/hostels"
                                        className={`block px-4 py-2 text-sm rounded-lg ${isActive('/admin/hostels')
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        Manage Blocks
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Gallery Section */}
                        <Link
                            to="/admin/gallery"
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/gallery') ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <Image size={20} />
                                <span className="font-medium">Gallery</span>
                            </div>
                        </Link>
                    </nav>

                    <div className="p-4 border-t">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={handleLogout}
                        >
                            <LogOut size={20} className="mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm p-4 md:hidden flex justify-between items-center">
                    <span className="font-heading font-bold text-lg">Admin Panel</span>
                    <button onClick={() => setIsSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div >
        </div >
    );
}
