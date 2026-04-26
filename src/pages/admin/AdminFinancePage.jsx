import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wallet, TrendingUp, IndianRupee, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg border border-muted-grey shadow-sm">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold mt-2 text-foreground">{value}</h3>
                {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
            </div>
            <div className={`p-3 rounded-full ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
        </div>
    </div>
);

export default function AdminFinancePage() {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ revenue: 0, totalExpenses: 0, netProfit: 0 });
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        type: 'Expense',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const [txRes, statsRes] = await Promise.all([
                axios.get(`${API_URL}/finance`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            setTransactions(txRes.data);
            setStats({
                revenue: statsRes.data.revenue || 0,
                totalExpenses: statsRes.data.totalExpenses || 0,
                netProfit: statsRes.data.netProfit || 0
            });
        } catch (error) {
            console.error('Error fetching finance data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/finance`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAddOpen(false);
            setFormData({ ...formData, amount: '', description: '', category: '' });
            fetchData();
        } catch (error) {
            console.error('Error adding transaction:', error);
            alert('Failed to add transaction');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/finance/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('Failed to delete transaction');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="font-heading text-3xl text-foreground">Finance & Expenses</h1>
                <Button className="bg-primary text-white hover:bg-primary/90" onClick={() => setIsAddOpen(true)}>
                    <PlusCircle size={18} className="mr-2" />
                    Add Transaction
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Income (Students + Misc)"
                    value={`₹${stats.revenue.toLocaleString()}`}
                    icon={TrendingUp}
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Expenses"
                    value={`₹${stats.totalExpenses.toLocaleString()}`}
                    icon={Wallet}
                    color="bg-red-500"
                />
                <StatCard
                    title="Net Revenue"
                    value={`₹${stats.netProfit.toLocaleString()}`}
                    icon={IndianRupee}
                    color={stats.netProfit >= 0 ? "bg-emerald-600" : "bg-orange-600"}
                />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-muted-grey overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-heading text-lg font-bold">Transaction History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-700">Date</th>
                                <th className="px-6 py-4 font-medium text-gray-700">Type</th>
                                <th className="px-6 py-4 font-medium text-gray-700">Category</th>
                                <th className="px-6 py-4 font-medium text-gray-700">Description</th>
                                <th className="px-6 py-4 font-medium text-gray-700 text-right">Amount</th>
                                <th className="px-6 py-4 font-medium text-gray-700 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading transactions...</td></tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No transactions found.</td></tr>
                            ) : (
                                transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-600 pb-4">{new Date(t.date || t.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.type === 'Income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">{t.category}</td>
                                        <td className="px-6 py-4 text-gray-600">{t.description}</td>
                                        <td className={`px-6 py-4 font-bold text-right ${t.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                                            {t.type === 'Income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => handleDelete(t.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Transaction Dialog */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="Expense">Expense</option>
                                        <option value="Income">Income</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    >
                                        <option value="">Select...</option>
                                        {formData.type === 'Expense' ? (
                                            <>
                                                <option value="Groceries">Groceries / Food</option>
                                                <option value="Salaries">Staff Salaries</option>
                                                <option value="Maintenance">Maintenance & Repairs</option>
                                                <option value="Utilities">Utilities (Water/Electricity)</option>
                                                <option value="Other Expense">Other Expense</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="Misc Fees">Misc Fees / Fines</option>
                                                <option value="Donation">Donation / Grant</option>
                                                <option value="Other Income">Other Income</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                                <input
                                    type="number"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Transaction'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
