import React, { useEffect, useState } from 'react';
import {
    getRegistrations,
    updateRegistrationStatus,
    subscribeToProgramSettings,
    type RegistrationWithId,
    type ProgramSettings
} from '../../lib/registrationService';
import {
    CheckCircle,
    XCircle,
    Clock,
    Search,
    Download
} from 'lucide-react';

const TeensRegistrationList: React.FC = () => {
    const [registrations, setRegistrations] = useState<RegistrationWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState<ProgramSettings | null>(null);

    useEffect(() => {
        fetchData();
        const unsub = subscribeToProgramSettings(setStats);
        return () => unsub();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getRegistrations();
            setRegistrations(data);
        } catch (error) {
            console.error("Error fetching registrations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        if (!confirm(`Are you sure you want to ${status} this applicant?`)) return;

        try {
            await updateRegistrationStatus(id, status);
            // Optimistic update
            setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const filteredRegistrations = registrations.filter(r => {
        const matchesFilter = filter === 'ALL' || r.status === filter;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            r.childName.toLowerCase().includes(searchLower) ||
            r.parentName.toLowerCase().includes(searchLower) ||
            r.phone.includes(searchLower);

        return matchesFilter && matchesSearch;
    });

    const exportToCSV = () => {
        const headers = ["Child Name", "Age", "Gender", "Parent", "Phone", "Type", "Activity", "City", "Status"];
        const rows = filteredRegistrations.map(r => [
            r.childName, r.age, r.gender, r.parentName, r.phone, r.type, r.activity, r.city, r.status
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "registrations.csv");
        document.body.appendChild(link);
        link.click();
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading registrations...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Ramadan Teens Registrations</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Slots: Gen {stats?.general_slots_taken}/{stats?.general_limit} | Comp {stats?.competition_slots_taken}/{stats?.competition_limit}
                    </p>
                </div>

                <div className="flex gap-2">
                    <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition">
                        <Download size={16} /> Export CSV
                    </button>
                    <button onClick={fetchData} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                        Refresh
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="p-6 bg-gray-50 border-b border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by name, parent, or phone..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${filter === f
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Child Name</th>
                            <th className="px-6 py-4">Wait/Age</th>
                            <th className="px-6 py-4">Activity</th>
                            <th className="px-6 py-4">Parent Details</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredRegistrations.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    No registrations found.
                                </td>
                            </tr>
                        ) : (
                            filteredRegistrations.map((reg) => (
                                <tr key={reg.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                                            ${reg.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                                                reg.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'}`}>
                                            {reg.status === 'APPROVED' && <CheckCircle size={12} />}
                                            {reg.status === 'REJECTED' && <XCircle size={12} />}
                                            {reg.status === 'PENDING' && <Clock size={12} />}
                                            {reg.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {reg.childName}
                                        <div className="text-xs text-gray-400 font-normal">{reg.gender}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {reg.age} years
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${reg.type === 'COMPETITION'
                                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                                : 'bg-blue-50 text-blue-800 border-blue-200'
                                            }`}>
                                            {reg.type === 'COMPETITION' ? '🏆 Comp' : '📘 General'}
                                        </span>
                                        <div className="text-xs mt-1 text-gray-500">{reg.activity}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium">{reg.parentName}</div>
                                        <div className="text-xs text-gray-500">{reg.phone}</div>
                                        <div className="text-xs text-gray-400 truncate max-w-[150px]">{reg.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {reg.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(reg.id, 'APPROVED')}
                                                        className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(reg.id, 'REJECTED')}
                                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {reg.status !== 'PENDING' && (
                                                <span className="text-xs text-gray-400 italic">No actions</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeensRegistrationList;
