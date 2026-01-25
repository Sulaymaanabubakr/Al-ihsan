import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { useCloudinary } from '../../hooks/useCloudinary';
import { LogOut, Upload, Image as ImageIcon, Plus, FileText, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ApplicationsView from './ApplicationsView';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { uploadImage, uploading } = useCloudinary();
    const [activeTab, setActiveTab] = useState<'gallery' | 'applications'>('applications');
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [pendingCount, setPendingCount] = useState(0);

    // Notification Listener
    useEffect(() => {
        const q = query(collection(db, 'applications'), where('status', '==', 'pending'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPendingCount(snapshot.size);
            // Browser notification could go here if permissions allowed
        });
        return unsubscribe;
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/admin/login');
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const result = await uploadImage(file);
        if (result) {
            await addDoc(collection(db, 'gallery'), {
                url: result.url,
                type: result.type,
                title,
                createdAt: new Date()
            });
            alert(`${result.type === 'video' ? 'Video' : 'Image'} uploaded successfully!`);
            setFile(null);
            setTitle('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-emerald-900 text-white p-6 hidden md:block">
                <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
                <nav className="space-y-4">
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors ${activeTab === 'applications' ? 'bg-emerald-800 text-white' : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'}`}
                    >
                        <FileText size={20} />
                        Applications
                        {pendingCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-auto">{pendingCount}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('gallery')}
                        className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors ${activeTab === 'gallery' ? 'bg-emerald-800 text-white' : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'}`}
                    >
                        <ImageIcon size={20} /> Gallery
                    </button>
                    {/* Add more admin links here */}
                </nav>
                <div className="absolute bottom-6 w-52">
                    <button onClick={handleLogout} className="flex items-center gap-2 text-emerald-200 hover:text-white w-full px-4 py-2">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {activeTab === 'gallery' ? 'Gallery Management' : 'Beneficiary Applications'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Bell size={24} className="text-gray-600" />
                            {pendingCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>}
                        </div>
                        <button onClick={handleLogout} className="md:hidden text-gray-600"><LogOut /></button>
                    </div>
                </header>

                {activeTab === 'applications' && <ApplicationsView />}

                {activeTab === 'gallery' && (
                    /* Upload Card */
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Upload size={20} /> Upload New Media</h3>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title/Caption</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="Event description..."
                                />
                            </div>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*,video/*"
                                />
                                {file ? (
                                    <span className="text-emerald-600 font-medium">{file.name}</span>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-500">
                                        <Plus size={32} />
                                        <span>Click to select image or video</span>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={uploading || !file}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? 'Uploading...' : 'Upload to Gallery'}
                            </button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
