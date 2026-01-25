import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FileText, Calendar, MapPin, Phone, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Application {
    id: string;
    fullName: string;
    phone: string;
    address: string;
    familySize: string;
    helpType: string;
    story: string;
    evidenceUrl?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: any;
}

const ApplicationsView: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const apps = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Application[];
            setApplications(apps);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
        if (!window.confirm(`Are you sure you want to ${status} this application?`)) return;
        try {
            await updateDoc(doc(db, 'applications', id), { status });
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading applications...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="text-emerald-600" /> Beneficiary Applications
            </h2>

            <div className="grid gap-4">
                {applications.length === 0 ? (
                    <p className="text-gray-500">No applications received yet.</p>
                ) : (
                    applications.map((app) => (
                        <div key={app.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{app.fullName}</h3>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {app.status === 'approved' && <CheckCircle size={12} />}
                                        {app.status === 'rejected' && <XCircle size={12} />}
                                        {app.status === 'pending' && <Clock size={12} />}
                                        {app.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-right text-xs text-gray-500">
                                    <div className="flex items-center justify-end gap-1"><Calendar size={12} /> {app.createdAt?.toDate().toLocaleDateString()}</div>
                                    <div className="font-medium text-emerald-600 mt-1">{app.helpType}</div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                                <p className="flex items-center gap-2 text-gray-600"><Phone size={14} /> {app.phone}</p>
                                <p className="flex items-center gap-2 text-gray-600"><MapPin size={14} /> {app.address}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <p className="text-gray-700 italic text-sm">"{app.story}"</p>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                <div>
                                    {app.evidenceUrl && (
                                        <a href={app.evidenceUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
                                            View Evidence
                                        </a>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {app.status === 'pending' && (
                                        <>
                                            <button onClick={() => updateStatus(app.id, 'rejected')} className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg">Reject</button>
                                            <button onClick={() => updateStatus(app.id, 'approved')} className="px-3 py-1.5 text-sm bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg">Approve</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ApplicationsView;
