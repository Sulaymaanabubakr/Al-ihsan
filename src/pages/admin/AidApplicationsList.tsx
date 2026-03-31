import React, { useEffect, useState } from 'react';
import {
    getAidApplications,
    updateAidApplicationStatus,
    type AidApplicationRecord,
    type AidApplicationStatus
} from '../../lib/aidApplicationService';
import {
    Download,
    Mail,
    Phone,
    Search,
    MapPin,
    HandHeart,
} from 'lucide-react';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'DECLINED'] as const;

const formatDate = (value: string) =>
    new Date(value).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

const escapeCsvCell = (value: string | number | boolean | undefined) => {
    const raw = value === undefined ? '' : String(value);
    return `"${raw.replace(/"/g, '""')}"`;
};

const statusBadge = (status: AidApplicationStatus) => {
    switch (status) {
        case 'APPROVED':
            return 'bg-emerald-100 text-emerald-700';
        case 'DECLINED':
            return 'bg-red-100 text-red-700';
        case 'UNDER_REVIEW':
            return 'bg-blue-100 text-blue-700';
        default:
            return 'bg-amber-100 text-amber-700';
    }
};

const AidApplicationsList: React.FC = () => {
    const [applications, setApplications] = useState<AidApplicationRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] =
        useState<(typeof STATUS_OPTIONS)[number]>('ALL');

    useEffect(() => {
        void fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const data = await getAidApplications();
            setApplications(data);
        } catch (error) {
            console.error('Error fetching aid applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (
        id: string,
        status: AidApplicationStatus
    ) => {
        try {
            await updateAidApplicationStatus(id, status);
            setApplications((prev) =>
                prev.map((app) =>
                    app.id === id ? { ...app, status } : app
                )
            );
        } catch (error) {
            console.error('Failed to update aid application status:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    const filteredApplications = applications.filter((app) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            app.fullName.toLowerCase().includes(search) ||
            app.email.toLowerCase().includes(search) ||
            app.phone.toLowerCase().includes(search) ||
            app.aidCategory.toLowerCase().includes(search) ||
            app.city.toLowerCase().includes(search);

        const matchesStatus =
            statusFilter === 'ALL' || app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const exportToCsv = () => {
        const headers = [
            'Submitted At',
            'Status',
            'Full Name',
            'Phone',
            'Email',
            'Address',
            'City',
            'State',
            'Aid Category',
            'Household Size',
            'Monthly Income',
            'Description',
            'Referral Source',
        ];

        const rows = filteredApplications.map((app) => [
            formatDate(app.createdAt),
            app.status,
            app.fullName,
            app.phone,
            app.email,
            app.address,
            app.city,
            app.state,
            app.aidCategory,
            app.householdSize,
            app.monthlyIncome,
            app.description,
            app.referralSource,
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.map((cell) => escapeCsvCell(cell)).join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        link.href = objectUrl;
        link.setAttribute('download', 'aid-applications.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
    };

    const statusCounts = applications.reduce<Record<string, number>>((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
    }, {});

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading aid applications...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Total Requests</p>
                    <p className="text-3xl font-bold text-primary-900 mt-2">{applications.length}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{statusCounts.PENDING || 0}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Under Review</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{statusCounts.UNDER_REVIEW || 0}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Approved</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{statusCounts.APPROVED || 0}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-primary-900 flex items-center gap-2">
                            <HandHeart size={20} className="text-gold-500" /> Aid / Help Requests
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Review beneficiary applications and manage assistance distribution.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={exportToCsv}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100 transition"
                        >
                            <Download size={16} /> Export CSV
                        </button>
                        <button
                            onClick={() => void fetchApplications()}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-b border-gray-100 flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, phone, email, category, or city..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {STATUS_OPTIONS.map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                                    statusFilter === status
                                        ? 'bg-primary-900 text-white'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                                }`}
                            >
                                {status.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {filteredApplications.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">
                            No aid applications match the current filters.
                        </div>
                    ) : (
                        filteredApplications.map((app) => (
                            <div key={app.id} className="p-6">
                                <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                                            <div>
                                                <h3 className="text-xl font-bold text-primary-900">
                                                    {app.fullName}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Submitted {formatDate(app.createdAt)}
                                                </p>
                                            </div>
                                            <span
                                                className={`inline-flex items-center w-fit px-3 py-1 rounded-full text-xs font-bold ${statusBadge(app.status)}`}
                                            >
                                                {app.status.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                                            <div className="bg-gold-50 border border-gold-100 rounded-xl p-4">
                                                <p className="text-gray-500 mb-1">Category</p>
                                                <p className="font-semibold text-gold-700">
                                                    {app.aidCategory}
                                                </p>
                                            </div>
                                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                                                <p className="text-gray-500 mb-1">Amount Needed</p>
                                                <p className="font-bold text-emerald-700">
                                                    {app.amountNeeded || 'Not specified'}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-gray-500 mb-1">Household Size</p>
                                                <p className="font-semibold text-gray-900">
                                                    {app.householdSize} person{app.householdSize > 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-gray-500 mb-1">Monthly Income</p>
                                                <p className="font-semibold text-gray-900">
                                                    {app.monthlyIncome || 'Not specified'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid lg:grid-cols-2 gap-4 text-sm">
                                            <div className="bg-white border border-gray-100 rounded-xl p-4">
                                                <p className="text-gray-500 mb-2 flex items-center gap-2">
                                                    <Phone size={14} /> Contact
                                                </p>
                                                <p className="font-medium text-gray-900">{app.phone}</p>
                                                {app.email && (
                                                    <p className="text-gray-600 mt-1 flex items-center gap-2">
                                                        <Mail size={14} /> {app.email}
                                                    </p>
                                                )}
                                                <p className="text-gray-600 mt-2 flex items-start gap-2">
                                                    <MapPin size={14} className="mt-0.5 shrink-0" />
                                                    {app.address}, {app.city}, {app.state}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-gray-500 mb-2">Summary</p>
                                                <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                                                    {app.description}
                                                </p>
                                            </div>
                                        </div>

                                        {app.situationDetails && (
                                            <div className="bg-gray-50 rounded-xl p-4 text-sm">
                                                <p className="text-gray-500 mb-2">Full Situation Details</p>
                                                <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                                                    {app.situationDetails}
                                                </p>
                                            </div>
                                        )}

                                        {/* Media Evidence */}
                                        {(app.photoUrls.length > 0 || app.videoUrl) && (
                                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
                                                <p className="text-blue-700 font-semibold mb-3">Media Evidence</p>
                                                {app.photoUrls.length > 0 && (
                                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
                                                        {app.photoUrls.map((url, i) => (
                                                            <a key={i} href={url} target="_blank" rel="noreferrer" className="block rounded-lg overflow-hidden border border-blue-200 aspect-square bg-white hover:opacity-80 transition">
                                                                <img src={url} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover" />
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                                {app.videoUrl && (
                                                    <a
                                                        href={app.videoUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium hover:bg-blue-200 transition"
                                                    >
                                                        ▶ Watch Applicant Video
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="xl:w-56 space-y-2">
                                        <button
                                            onClick={() => void handleStatusUpdate(app.id, 'UNDER_REVIEW')}
                                            className="w-full px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition"
                                        >
                                            Under Review
                                        </button>
                                        <button
                                            onClick={() => void handleStatusUpdate(app.id, 'APPROVED')}
                                            className="w-full px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100 transition"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => void handleStatusUpdate(app.id, 'DECLINED')}
                                            className="w-full px-4 py-2 rounded-lg bg-red-50 text-red-700 font-medium hover:bg-red-100 transition"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AidApplicationsList;
