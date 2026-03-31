import React, { useEffect, useState } from 'react';
import {
    getVolunteerApplications,
    updateVolunteerApplicationStatus,
    type VolunteerApplicationRecord,
    type VolunteerApplicationStatus
} from '../../lib/volunteerApplicationService';
import {
    Download,
    Mail,
    Phone,
    Search,
    ShieldCheck,
    UserCheck
} from 'lucide-react';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'REVIEWED', 'SHORTLISTED', 'DECLINED'] as const;

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

const VolunteerApplicationsList: React.FC = () => {
    const [applications, setApplications] = useState<VolunteerApplicationRecord[]>([]);
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
            const data = await getVolunteerApplications();
            setApplications(data);
        } catch (error) {
            console.error('Error fetching volunteer applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (
        id: string,
        status: VolunteerApplicationStatus
    ) => {
        try {
            await updateVolunteerApplicationStatus(id, status);
            setApplications((prev) =>
                prev.map((application) =>
                    application.id === id ? { ...application, status } : application
                )
            );
        } catch (error) {
            console.error('Failed to update volunteer application status:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    const filteredApplications = applications.filter((application) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            application.fullName.toLowerCase().includes(search) ||
            application.email.toLowerCase().includes(search) ||
            application.phone.toLowerCase().includes(search) ||
            application.preferredRole.toLowerCase().includes(search);

        const matchesStatus =
            statusFilter === 'ALL' || application.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const exportToCsv = () => {
        const headers = [
            'Submitted At',
            'Status',
            'Full Name',
            'Age',
            'Gender',
            'Phone',
            'Email',
            'City',
            'State',
            'Address',
            'Occupation',
            'Marital Status',
            'Preferred Role',
            'Availability',
            'Mosque/Community',
            'Emergency Contact Name',
            'Emergency Contact Phone',
            'Experience',
            'Motivation',
            'Amanah Answer',
            'Confidentiality Answer',
            'Adab Answer',
            'Scenario Response',
            'Quiz Score',
            'Accepted Terms',
            'Accepted Privacy',
            'Accepted Confidentiality',
            'Document URL',
        ];

        const rows = filteredApplications.map((application) => [
            formatDate(application.createdAt),
            application.status,
            application.fullName,
            application.age,
            application.gender,
            application.phone,
            application.email,
            application.city,
            application.state,
            application.address,
            application.occupation,
            application.maritalStatus,
            application.preferredRole,
            application.availability,
            application.mosqueCommunity,
            application.emergencyContactName,
            application.emergencyContactPhone,
            application.experience,
            application.motivation,
            application.qAmanah,
            application.qConfidentiality,
            application.qAdab,
            application.scenarioResponse,
            application.quizScore,
            application.acceptedTerms,
            application.acceptedPrivacy,
            application.acceptedConfidentiality,
            application.idDocumentUrl || '',
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.map((cell) => escapeCsvCell(cell)).join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        link.href = objectUrl;
        link.setAttribute('download', 'volunteer-applications.csv');
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
        return <div className="p-8 text-center text-gray-500">Loading volunteer applications...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Total Applicants</p>
                    <p className="text-3xl font-bold text-primary-900 mt-2">{applications.length}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Pending Review</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{statusCounts.PENDING || 0}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Shortlisted</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{statusCounts.SHORTLISTED || 0}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Avg. Quiz Score</p>
                    <p className="text-3xl font-bold text-primary-900 mt-2">
                        {applications.length
                            ? Math.round(
                                applications.reduce((sum, item) => sum + item.quizScore, 0) /
                                applications.length
                            )
                            : 0}
                        %
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-primary-900">Volunteer Applications</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Review applicants, assess readiness, and export the full register.
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
                            placeholder="Search by applicant, email, phone, or role..."
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
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {filteredApplications.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">
                            No volunteer applications match the current filters.
                        </div>
                    ) : (
                        filteredApplications.map((application) => (
                            <div key={application.id} className="p-6">
                                <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                                            <div>
                                                <h3 className="text-xl font-bold text-primary-900">
                                                    {application.fullName}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Submitted {formatDate(application.createdAt)}
                                                </p>
                                            </div>
                                            <span
                                                className={`inline-flex items-center w-fit px-3 py-1 rounded-full text-xs font-bold ${
                                                    application.status === 'SHORTLISTED'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : application.status === 'DECLINED'
                                                            ? 'bg-red-100 text-red-700'
                                                            : application.status === 'REVIEWED'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'bg-amber-100 text-amber-700'
                                                }`}
                                            >
                                                {application.status}
                                            </span>
                                        </div>

                                        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-gray-500 mb-1">Age / Gender</p>
                                                <p className="font-semibold text-gray-900">
                                                    {application.age} / {application.gender}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-gray-500 mb-1">Preferred Role</p>
                                                <p className="font-semibold text-gray-900">
                                                    {application.preferredRole}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-gray-500 mb-1">Availability</p>
                                                <p className="font-semibold text-gray-900">
                                                    {application.availability}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-gray-500 mb-1">Quiz Score</p>
                                                <p className="font-semibold text-gray-900">
                                                    {application.quizScore}%
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid lg:grid-cols-2 gap-4 text-sm">
                                            <div className="bg-white border border-gray-100 rounded-xl p-4">
                                                <p className="text-gray-500 mb-2 flex items-center gap-2">
                                                    <Phone size={14} /> Contact
                                                </p>
                                                <p className="font-medium text-gray-900">{application.phone}</p>
                                                <p className="text-gray-600 mt-1 flex items-center gap-2">
                                                    <Mail size={14} /> {application.email}
                                                </p>
                                                <p className="text-gray-600 mt-2">
                                                    {application.address}, {application.city}, {application.state}
                                                </p>
                                            </div>
                                            <div className="bg-white border border-gray-100 rounded-xl p-4">
                                                <p className="text-gray-500 mb-2 flex items-center gap-2">
                                                    <UserCheck size={14} /> Background
                                                </p>
                                                <p><span className="font-semibold text-gray-900">Occupation:</span> {application.occupation}</p>
                                                <p className="mt-1"><span className="font-semibold text-gray-900">Marital Status:</span> {application.maritalStatus}</p>
                                                <p className="mt-1"><span className="font-semibold text-gray-900">Mosque/Community:</span> {application.mosqueCommunity}</p>
                                                <p className="mt-1"><span className="font-semibold text-gray-900">Emergency:</span> {application.emergencyContactName} ({application.emergencyContactPhone})</p>
                                            </div>
                                        </div>

                                        <div className="grid lg:grid-cols-2 gap-4 text-sm">
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-gray-500 mb-2">Experience</p>
                                                <p className="text-gray-800 whitespace-pre-line">
                                                    {application.experience}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-gray-500 mb-2">Motivation</p>
                                                <p className="text-gray-800 whitespace-pre-line">
                                                    {application.motivation}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid lg:grid-cols-2 gap-4 text-sm">
                                            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
                                                <p className="text-primary-700 font-semibold mb-2">
                                                    Islamic Volunteer Readiness
                                                </p>
                                                <p><span className="font-semibold">Amanah:</span> {application.qAmanah}</p>
                                                <p className="mt-2"><span className="font-semibold">Confidentiality:</span> {application.qConfidentiality}</p>
                                                <p className="mt-2"><span className="font-semibold">Adab:</span> {application.qAdab}</p>
                                            </div>
                                            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
                                                <p className="text-primary-700 font-semibold mb-2">
                                                    Scenario Response
                                                </p>
                                                <p className="text-gray-800 whitespace-pre-line">
                                                    {application.scenarioResponse}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm">
                                            <p className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                                                <ShieldCheck size={14} /> Compliance Declarations
                                            </p>
                                            <div className="grid md:grid-cols-3 gap-2 text-amber-900">
                                                <p>Terms: {application.acceptedTerms ? 'Accepted' : 'Missing'}</p>
                                                <p>Privacy: {application.acceptedPrivacy ? 'Accepted' : 'Missing'}</p>
                                                <p>Confidentiality: {application.acceptedConfidentiality ? 'Accepted' : 'Missing'}</p>
                                            </div>
                                            {application.idDocumentUrl && (
                                                <a
                                                    href={application.idDocumentUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-block mt-3 text-primary-900 font-semibold hover:underline"
                                                >
                                                    View uploaded document
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="xl:w-56 space-y-2">
                                        <button
                                            onClick={() => void handleStatusUpdate(application.id, 'REVIEWED')}
                                            className="w-full px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition"
                                        >
                                            Mark Reviewed
                                        </button>
                                        <button
                                            onClick={() => void handleStatusUpdate(application.id, 'SHORTLISTED')}
                                            className="w-full px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100 transition"
                                        >
                                            Shortlist
                                        </button>
                                        <button
                                            onClick={() => void handleStatusUpdate(application.id, 'DECLINED')}
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

export default VolunteerApplicationsList;
