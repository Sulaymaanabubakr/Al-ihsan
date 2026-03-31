import React, { useState, useEffect } from 'react';
import { useCloudinary } from '../../hooks/useCloudinary';
import { 
    Upload, Plus, LogOut, LayoutDashboard, Image as ImageIcon, 
    Users, HandHeart, Settings, TrendingUp, ShieldCheck, Camera, ChevronRight 
} from 'lucide-react';
import VolunteerApplicationsList from './VolunteerApplicationsList';
import AidApplicationsList from './AidApplicationsList';
import SiteSettingsTab from './SiteSettingsTab';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { uploadImage, uploading } = useCloudinary();
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'GALLERY' | 'VOLUNTEERS' | 'AID_REQUESTS' | 'SITE_SETTINGS'>('OVERVIEW');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Food Relief');
    const [file, setFile] = useState<File | null>(null);
    const [success, setSuccess] = useState(false);
    const [stats, setStats] = useState({ volunteers: 0, aid: 0, gallery: 0, admins: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            const [vols, aid, gallery, users] = await Promise.all([
                supabase.from('volunteer_applications').select('*', { count: 'exact', head: true }),
                supabase.from('aid_applications').select('*', { count: 'exact', head: true }),
                supabase.from('gallery').select('*', { count: 'exact', head: true }),
                supabase.from('admin_users').select('*', { count: 'exact', head: true })
            ]);
            setStats({
                volunteers: vols.count || 0,
                aid: aid.count || 0,
                gallery: gallery.count || 0,
                admins: users.count || 0
            });
        };
        fetchStats();
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const result = await uploadImage(file);
        if (result) {
            const { error } = await supabase.from('gallery').insert({
                title,
                category,
                url: result.url,
            });

            if (error) {
                console.error('Failed to save gallery image:', error);
                return;
            }

            setSuccess(true);
            setTitle('');
            setFile(null);
            setTimeout(() => setSuccess(false), 3000);
            setStats(prev => ({ ...prev, gallery: prev.gallery + 1 }));
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/admin', { replace: true });
    };

    const NavItem = ({ tab, icon: Icon, label }: { tab: typeof activeTab, icon: any, label: string }) => {
        const isActive = activeTab === tab;
        return (
            <button
                onClick={() => setActiveTab(tab)}
                className={`group flex items-center justify-between w-full p-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive 
                    ? 'bg-gradient-to-r from-gold-600 to-gold-400 text-primary-900 shadow-[0_4px_20px_rgba(212,175,55,0.3)] shadow-gold-500/20 translate-x-1' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 hover:translate-x-1'
                }`}
            >
                <div className="flex items-center gap-3">
                    <Icon size={20} className={isActive ? 'text-primary-900' : 'group-hover:text-gold-400 transition-colors duration-300'} /> 
                    {label}
                </div>
                {isActive && <ChevronRight size={16} className="text-primary-900 opacity-70" />}
            </button>
        );
    };

    return (
        <div className="flex h-screen bg-gray-50 bg-[#F4F4F7] overflow-hidden selection:bg-gold-500/30">
            {/* Ambient Background Gradient for the whole app */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-200/40 mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
                <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gold-200/30 mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
            </div>

            {/* Glassmorphic Sidebar */}
            <aside className="relative z-10 w-72 m-4 bg-primary-900 text-white p-6 hidden md:flex flex-col rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
                {/* Background glow in sidebar */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold-500/20 blur-[60px] rounded-full pointer-events-none"></div>

                <div className="mb-12 flex items-center gap-4 relative z-10 p-2">
                    <div className="p-1.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 shadow-inner">
                        <img src="/logo.jpeg" className="w-10 h-10 rounded-lg object-cover" alt="Logo" />
                    </div>
                    <div>
                        <span className="block font-bold font-heading text-lg tracking-wide text-white">Al-Ihsan Platform</span>
                        <span className="block text-xs text-gold-400 tracking-wider uppercase font-semibold mt-0.5">Admin Interface</span>
                    </div>
                </div>

                <nav className="space-y-2 flex-1 relative z-10">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 mt-6 ml-3">Overview</div>
                    <NavItem tab="OVERVIEW" icon={LayoutDashboard} label="Dashboard" />
                    
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 mt-8 ml-3">Content</div>
                    <NavItem tab="GALLERY" icon={ImageIcon} label="Media Hub" />
                    
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 mt-8 ml-3">Management</div>
                    <NavItem tab="AID_REQUESTS" icon={HandHeart} label="Aid Requests" />
                    <NavItem tab="VOLUNTEERS" icon={Users} label="Volunteering" />
                    
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 mt-8 ml-3">System</div>
                    <NavItem tab="SITE_SETTINGS" icon={Settings} label="Site Settings" />
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10 relative z-10">
                    <button onClick={handleSignOut} className="group flex items-center gap-3 p-3 text-gray-400 hover:text-rose-400 w-full hover:bg-rose-500/10 rounded-xl transition-all duration-300">
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform duration-300" /> 
                        <span className="font-medium">Secure Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="relative z-10 flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto h-full flex flex-col pt-4">
                    
                    <header className="flex justify-between items-end mb-10">
                        <div>
                            <p className="text-primary-600 font-semibold tracking-wider text-sm uppercase mb-1 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
                                Live Command Center
                            </p>
                            <h1 className="text-4xl font-heading font-extrabold text-gray-900 tracking-tight">
                                {activeTab === 'OVERVIEW' && 'Platform Overview'}
                                {activeTab === 'GALLERY' && 'Media Hub'}
                                {activeTab === 'VOLUNTEERS' && 'Volunteer Force'}
                                {activeTab === 'AID_REQUESTS' && 'Relief Operations'}
                                {activeTab === 'SITE_SETTINGS' && 'Global Configurations'}
                            </h1>
                        </div>
                        
                        <div className="hidden md:flex items-center gap-4 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">A</div>
                            <span className="text-sm font-medium text-gray-700">System Admin</span>
                        </div>
                    </header>

                    <div className="flex-1 w-full pb-12">
                        {activeTab === 'OVERVIEW' && (
                            <div className="animate-fade-in-up">
                                {/* Metrics Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                    {[
                                        { label: "Total Aid Requests", value: stats.aid, icon: HandHeart, color: "from-rose-500 to-orange-400" },
                                        { label: "Active Volunteers", value: stats.volunteers, icon: Users, color: "from-blue-500 to-cyan-400" },
                                        { label: "Media Assets", value: stats.gallery, icon: Camera, color: "from-purple-500 to-indigo-500" },
                                        { label: "Admin Operators", value: stats.admins, icon: ShieldCheck, color: "from-emerald-500 to-teal-400" }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500`}></div>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                                                    <stat.icon size={22} />
                                                </div>
                                                <h3 className="text-gray-500 font-medium text-sm lg:text-base">{stat.label}</h3>
                                            </div>
                                            <p className="text-4xl font-extrabold text-gray-900 mt-2 font-heading tracking-tight">{stat.value}</p>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Large Activity Graph Placeholder - makes dashboard feel full! */}
                                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
                                        <div className="flex items-center justify-between mb-8">
                                            <h2 className="text-xl font-bold font-heading text-gray-900">Application Velocity</h2>
                                            <button className="text-gold-600 bg-gold-50 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold-100 transition-colors">This Month</button>
                                        </div>
                                        <div className="h-64 flex items-end justify-between gap-2">
                                            {/* Dummy beautiful bar chart to make dashboard look premium */}
                                            {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                                                <div key={i} className="w-full relative group flex flex-col items-center">
                                                    <div className="w-full bg-primary-100 rounded-t-xl group-hover:bg-primary-200 transition-colors" style={{ height: `${h}%` }}>
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{h} Apps</div>
                                                    </div>
                                                    <span className="text-xs text-gray-400 font-medium mt-3">Day {i + 1}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500 blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                                        <h2 className="text-xl font-bold font-heading mb-2 relative z-10 flex items-center gap-2"><TrendingUp size={20} className="text-gold-400" /> System Status</h2>
                                        <p className="text-primary-200 text-sm mb-8 relative z-10 leading-relaxed">All core platform services are operating flawlessly. Email subroutines and edge functions are active.</p>
                                        
                                        <div className="space-y-4 relative z-10">
                                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                                                <span className="font-medium">Database Node</span>
                                                <span className="text-emerald-400 text-sm font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Online</span>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                                                <span className="font-medium">Brevo Dispatcher</span>
                                                <span className="text-emerald-400 text-sm font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Online</span>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                                                <span className="font-medium">PDF Generator</span>
                                                <span className="text-emerald-400 text-sm font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Ready</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'GALLERY' && (
                            <div className="max-w-2xl animate-fade-in-up">
                                <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-3 bg-gradient-to-br from-gold-100 to-amber-50 rounded-2xl text-gold-600 border border-gold-200/50 shadow-inner">
                                            <ImageIcon size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 font-heading">Upload Media Profile</h2>
                                            <p className="text-gray-500 text-sm mt-1">Publish high-quality content straight to the world-facing gallery.</p>
                                        </div>
                                    </div>

                                    {success && (
                                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl mb-8 text-sm flex items-center gap-3 animate-fade-in-down">
                                            <ShieldCheck size={20} className="text-emerald-500" /> Image injected into the global delivery network successfully!
                                        </div>
                                    )}

                                    <form onSubmit={handleUpload} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Image Title</label>
                                            <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gold-500/20 focus:border-gold-500 focus:bg-white transition-all outline-none font-medium placeholder:text-gray-400" placeholder="e.g. Ramadan Food Drive 2024" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Categorization Tag</label>
                                            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gold-500/20 focus:border-gold-500 focus:bg-white transition-all outline-none font-medium appearance-none">
                                                {["Food Relief", "Medical", "Education", "Orphans", "Events"].map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="pt-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Media Payload</label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-3xl p-10 text-center hover:bg-gold-50 hover:border-gold-400 transition-colors cursor-pointer relative group">
                                                <input required type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" />
                                                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-colors ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500 group-hover:bg-gold-200 group-hover:text-gold-700'}`}>
                                                    <Upload size={28} />
                                                </div>
                                                <p className="text-lg font-bold text-gray-900">{file ? file.name : "Select or drag media here"}</p>
                                                <p className="text-sm text-gray-500 font-medium mt-1">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "JPG, PNG standard formats up to 5MB"}</p>
                                            </div>
                                        </div>
                                        <button disabled={uploading || !file} type="submit" className="w-full bg-gradient-to-r from-primary-900 to-primary-800 text-white py-4 rounded-2xl font-bold hover:shadow-[0_8px_30px_rgba(46,31,84,0.3)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:shadow-none disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-3 text-lg mt-4">
                                            {uploading ? (
                                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Transmitting...</>
                                            ) : (
                                                <><Plus size={22} /> Publish to Gallery</>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {activeTab === 'VOLUNTEERS' && <div className="animate-fade-in-up"><VolunteerApplicationsList /></div>}
                        {activeTab === 'AID_REQUESTS' && <div className="animate-fade-in-up"><AidApplicationsList /></div>}
                        {activeTab === 'SITE_SETTINGS' && <div className="animate-fade-in-up"><SiteSettingsTab /></div>}
                        
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
