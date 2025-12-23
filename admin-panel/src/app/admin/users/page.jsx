"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Loader2 } from 'lucide-react';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/admin/users');
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleStatus = async (user) => {
        try {
            // Optimistic update
            const newStatus = !user.isActive;
            setUsers(users.map(u => u._id === user._id ? { ...u, isActive: newStatus } : u));

            await axios.patch('/api/admin/users', { id: user._id, isActive: newStatus });
        } catch (error) {
            console.error("Failed to update status", error);
            fetchUsers(); // revert
        }
    };

    const filteredUsers = users.filter(user =>
        (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /> Loading users...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Users Management</h1>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                        <tr>
                            <th className="p-4 font-semibold">User</th>
                            <th className="p-4 font-semibold">Contact</th>
                            <th className="p-4 font-semibold">Registered</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredUsers.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-slate-400">No users found.</td></tr>
                        ) : filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-slate-50/50">
                                <td className="p-4 font-medium text-slate-900 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-400">
                                        {user.image ? <img src={user.image} alt="" className="w-full h-full object-cover" /> : user.name[0]}
                                    </div>
                                    {user.name}
                                </td>
                                <td className="p-4 text-slate-600">
                                    <div className="flex flex-col">
                                        <span>{user.email || 'N/A'}</span>
                                        <span className="text-xs text-slate-400">{user.phone}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {user.isActive ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => toggleStatus(user)}
                                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${user.isActive
                                                ? 'border-red-200 text-red-600 hover:bg-red-50'
                                                : 'border-green-200 text-green-600 hover:bg-green-50'
                                            }`}
                                    >
                                        {user.isActive ? 'Disable' : 'Enable'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
