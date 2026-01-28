import React, { useState } from 'react';
import { useCloudinary } from '../../hooks/useCloudinary';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Upload, Plus, LogOut, LayoutDashboard, Image as ImageIcon, Users, BookOpen } from 'lucide-react';
import TeensRegistrationList from './TeensRegistrationList';

const Dashboard: React.FC = () => {
    const { uploadImage, uploading } = useCloudinary();
    const [activeTab, setActiveTab] = useState<'GALLERY' | 'TEENS'>('GALLERY');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Food Relief');
    const [file, setFile] = useState<File | null>(null);
    const [success, setSuccess] = useState(false);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const result = await uploadImage(file);
        if (result) {
            await addDoc(collection(db, 'gallery'), {
                title,
                category,
                url: result.url,
                createdAt: serverTimestamp()
            });
            setSuccess(true);
            setTitle('');
            setFile(null);
            setTimeout(() => setSuccess(false), 3000);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-primary-900 text-white p-6 hidden md:block">
                <div className="mb-10 flex items-center gap-3">
                    <img src="/logo.jpeg" className="w-8 h-8 rounded-full border border-gold-500" />
                    <span className="font-bold font-heading text-lg">Admin Panel</span>
                </div>
                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveTab('GALLERY')}
                        className={`flex items-center gap-3 p-3 w-full text-left rounded-lg font-medium transition ${activeTab === 'GALLERY' ? 'bg-white/10 text-gold-400' : 'text-gray-400 hover:text-white'}`}
                    >
                        <LayoutDashboard size={20} /> Dashboard / Gallery
                    </button>
                    <button
                        onClick={() => setActiveTab('TEENS')}
                        className={`flex items-center gap-3 p-3 w-full text-left rounded-lg font-medium transition ${activeTab === 'TEENS' ? 'bg-white/10 text-gold-400' : 'text-gray-400 hover:text-white'}`}
                    >
                        <BookOpen size={20} /> Teens Program
                    </button>

                    <div className="flex items-center gap-3 p-3 text-gray-400 hover:text-white cursor-not-allowed">
                        <Users size={20} /> Applications
                    </div>
                </nav>
                <div className="absolute bottom-6 w-52">
                    <button onClick={() => auth.signOut()} className="flex items-center gap-3 p-3 text-red-400 hover:text-red-300 w-full hover:bg-white/5 rounded-lg transition-colors">
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-heading font-bold text-primary-900">
                        {activeTab === 'GALLERY' ? 'Content Management' : 'Ramadan Teens Program'}
                    </h1>
                </header>

                {activeTab === 'TEENS' ? (
                    <TeensRegistrationList />
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Gallery Upload Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                <div className="p-2 bg-purple-50 rounded-lg text-primary-600">
                                    <ImageIcon size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Upload to Gallery</h2>
                            </div>

                            {success && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">Image uploaded successfully!</div>}

                            <form onSubmit={handleUpload} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image Title</label>
                                    <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" placeholder="e.g. Food Distribution" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gold-500 outline-none bg-white">
                                        {["Food Relief", "Medical", "Education", "Orphans", "Events"].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 cursor-pointer relative">
                                    <input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                                    <Upload className={`mx-auto mb-2 ${file ? 'text-green-500' : 'text-gray-400'}`} />
                                    <p className="text-sm text-gray-500">{file ? file.name : "Click to select image"}</p>
                                </div>
                                <button disabled={uploading} type="submit" className="w-full bg-primary-900 text-white py-3 rounded-lg font-bold hover:bg-primary-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                                    {uploading ? 'Uploading...' : <><Plus size={18} /> Add to Gallery</>}
                                </button>
                            </form>
                        </div>

                        {/* Stats Card (Placeholder) */}
                        <div className="bg-primary-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500 rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                            <h2 className="text-xl font-bold mb-4 relative z-10">Quick Stats</h2>
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                    <p className="text-gold-400 text-sm mb-1">Total Applications</p>
                                    <p className="text-3xl font-bold">0</p>
                                </div>
                                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                    <p className="text-gold-400 text-sm mb-1">Gallery Images</p>
                                    <p className="text-3xl font-bold">-</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
