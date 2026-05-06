import React, { useEffect, useState } from 'react';
import { useCloudinary } from '../../hooks/useCloudinary';
import { supabase } from '../../lib/supabase';
import EmptyState from '../../components/admin/EmptyState';
import ActionModal, { type ActionModalState } from '../../components/admin/ActionModal';
import {
    Upload, Plus, Search, Trash2, Image as ImageIcon, Video,
    Film, Link2, X, ShieldCheck, ExternalLink, Filter
} from 'lucide-react';

type MediaType = 'image' | 'video' | 'video_link';
type FilterType = 'ALL' | 'image' | 'video' | 'video_link';

interface MediaItem {
    id: string;
    title: string;
    description: string;
    category: string;
    url: string;
    mediaType: MediaType;
    createdAt: string;
    source: 'gallery' | 'videos';
}

const CATEGORIES = ['Food Relief', 'Medical', 'Education', 'Orphans', 'Events', 'General'];

const formatDate = (v: string) =>
    new Date(v).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const isVideoUrl = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
const isEmbedUrl = (url: string) => /youtube\.com|youtu\.be|vimeo\.com/i.test(url);

const getEmbedUrl = (url: string): string | null => {
    try {
        const parsed = new URL(url);
        if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
            const videoId = parsed.hostname.includes('youtu.be')
                ? parsed.pathname.slice(1)
                : parsed.searchParams.get('v');
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        }
        if (parsed.hostname.includes('vimeo.com')) {
            const videoId = parsed.pathname.split('/').filter(Boolean).pop();
            return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
        }
    } catch { /* ignore */ }
    return null;
};

const MediaHubTab: React.FC = () => {
    const { uploadImage, uploading } = useCloudinary();

    // Upload form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('General');
    const [uploadType, setUploadType] = useState<'image' | 'video_upload' | 'video_link'>('image');
    const [file, setFile] = useState<File | null>(null);
    const [videoLinkUrl, setVideoLinkUrl] = useState('');
    const [success, setSuccess] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Library state
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [deleting, setDeleting] = useState<string | null>(null);

    // Confirmation modal
    const [modalState, setModalState] = useState<ActionModalState>('HIDDEN');
    const [modalConfig, setModalConfig] = useState({ title: '', message: '', isDanger: false, confirmText: 'Confirm', successMessage: '' });
    const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

    useEffect(() => { void loadMedia(); }, []);

    const loadMedia = async () => {
        setLoading(true);
        try {
            const [galleryRes, videosRes] = await Promise.all([
                supabase.from('gallery').select('*').order('created_at', { ascending: false }),
                supabase.from('videos').select('*').order('created_at', { ascending: false }),
            ]);

            const galleryItems: MediaItem[] = (galleryRes.data ?? []).map((row: any) => ({
                id: row.id,
                title: row.title ?? '',
                description: row.description ?? '',
                category: row.category ?? 'General',
                url: row.url,
                mediaType: (row.media_type === 'video' ? 'video' : 'image') as MediaType,
                createdAt: row.created_at,
                source: 'gallery' as const,
            }));

            const videoItems: MediaItem[] = (videosRes.data ?? []).map((row: any) => ({
                id: row.id,
                title: row.title ?? '',
                description: row.description ?? '',
                category: row.category ?? 'General',
                url: row.url,
                mediaType: 'video_link' as MediaType,
                createdAt: row.created_at,
                source: 'videos' as const,
            }));

            setItems([...galleryItems, ...videoItems].sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ));
        } catch (e) {
            console.error('Failed to load media:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            if (uploadType === 'video_link') {
                if (!videoLinkUrl.trim()) return;
                const { error } = await supabase.from('videos').insert({
                    title: title.trim(),
                    description: description.trim(),
                    category,
                    url: videoLinkUrl.trim(),
                });
                if (error) throw error;
            } else {
                if (!file) return;
                const result = await uploadImage(file);
                if (!result) return;
                const { error } = await supabase.from('gallery').insert({
                    title: title.trim(),
                    description: description.trim(),
                    category,
                    url: result.url,
                    media_type: uploadType === 'video_upload' ? 'video' : 'image',
                });
                if (error) throw error;
            }

            setSuccess(true);
            setTitle('');
            setDescription('');
            setFile(null);
            setVideoLinkUrl('');
            setShowForm(false);
            await loadMedia();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Upload failed:', err);
        }
    };

    const confirmDelete = (item: MediaItem) => {
        setModalConfig({
            title: 'Delete Media',
            message: `Permanently delete "${item.title}"? This cannot be undone.`,
            isDanger: true,
            confirmText: 'Delete',
            successMessage: 'Media deleted successfully.',
        });
        setPendingAction(() => async () => {
            const table = item.source === 'videos' ? 'videos' : 'gallery';
            const { error } = await supabase.from(table).delete().eq('id', item.id);
            if (error) throw error;
            setItems(prev => prev.filter(i => i.id !== item.id));
        });
        setModalState('CONFIRMATION');
    };

    const executeAction = async () => {
        if (!pendingAction) return;
        setModalState('LOADING');
        try {
            await pendingAction();
            setModalState('SUCCESS');
        } catch {
            setModalState('ERROR');
        }
    };

    const filtered = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase()) ||
            item.category.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'ALL' || item.mediaType === filter;
        return matchesSearch && matchesFilter;
    });

    const counts = {
        all: items.length,
        images: items.filter(i => i.mediaType === 'image').length,
        videos: items.filter(i => i.mediaType === 'video').length,
        links: items.filter(i => i.mediaType === 'video_link').length,
    };

    return (
        <div className="space-y-6">
            {/* Success Toast */}
            {success && (
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 p-3 rounded-lg text-sm flex items-center gap-2">
                    <ShieldCheck size={16} /> Media published successfully.
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#111827] p-5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Media</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{counts.all}</p>
                </div>
                <div className="bg-white dark:bg-[#111827] p-5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <ImageIcon size={14} className="text-blue-500" />
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Images</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{counts.images}</p>
                </div>
                <div className="bg-white dark:bg-[#111827] p-5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <Film size={14} className="text-purple-500" />
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Videos</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">{counts.videos}</p>
                </div>
                <div className="bg-white dark:bg-[#111827] p-5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <Link2 size={14} className="text-amber-500" />
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">YT / Vimeo</p>
                    </div>
                    <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">{counts.links}</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search media..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1F2937] text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400" />
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                        {([
                            { key: 'ALL', label: 'All', icon: Filter },
                            { key: 'image', label: 'Images', icon: ImageIcon },
                            { key: 'video', label: 'Videos', icon: Film },
                            { key: 'video_link', label: 'Links', icon: Link2 },
                        ] as const).map(f => (
                            <button key={f.key} onClick={() => setFilter(f.key)}
                                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition ${filter === f.key
                                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}>
                                <f.icon size={12} />
                                <span className="hidden sm:inline">{f.label}</span>
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg font-medium text-sm hover:bg-primary-700 transition shadow-sm">
                        <Plus size={16} /> Upload
                    </button>
                </div>
            </div>

            {/* Upload Form Modal */}
            {showForm && (
                <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-white/10 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload Media</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Add images, videos, or YouTube/Vimeo links to the gallery.</p>
                        </div>
                        <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition"><X size={20} /></button>
                    </div>

                    {/* Media Type Selector */}
                    <div className="flex gap-2 mb-6">
                        {([
                            { key: 'image', label: 'Image', icon: ImageIcon, desc: 'JPG, PNG, WebP' },
                            { key: 'video_upload', label: 'Video File', icon: Film, desc: 'MP4, WebM' },
                            { key: 'video_link', label: 'Video Link', icon: Link2, desc: 'YouTube, Vimeo' },
                        ] as const).map(t => (
                            <button key={t.key} onClick={() => { setUploadType(t.key); setFile(null); setVideoLinkUrl(''); }}
                                className={`flex-1 flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all ${uploadType === t.key
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                                }`}>
                                <t.icon size={20} />
                                <span className="text-xs font-bold">{t.label}</span>
                                <span className="text-[10px] opacity-70">{t.desc}</span>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Title *</label>
                                <input required value={title} onChange={e => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm text-slate-900 dark:text-white"
                                    placeholder="e.g. Ramadan Food Drive 2025" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                                <select value={category} onChange={e => setCategory(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm text-slate-900 dark:text-white">
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm text-slate-900 dark:text-white resize-none"
                                placeholder="Describe this media item — what event, who's involved, the impact..." />
                        </div>

                        {/* File Upload or Link Input */}
                        {uploadType === 'video_link' ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Video URL *</label>
                                <input required value={videoLinkUrl} onChange={e => setVideoLinkUrl(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm text-slate-900 dark:text-white"
                                    placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..." />
                                {videoLinkUrl && getEmbedUrl(videoLinkUrl) && (
                                    <div className="mt-3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video">
                                        <iframe src={getEmbedUrl(videoLinkUrl)!} className="w-full h-full" loading="lazy"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">File *</label>
                                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer relative group">
                                    <input required type="file" onChange={e => setFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        accept={uploadType === 'image' ? 'image/*' : 'video/*'} />
                                    <Upload size={24} className={`mx-auto mb-3 transition-colors ${file ? 'text-emerald-500' : 'text-slate-400 group-hover:text-primary-500'}`} />
                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-300">
                                        {file ? file.name : 'Click or drag file here'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                                        {file
                                            ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                                            : uploadType === 'image' ? 'JPG, PNG, WebP · Up to 10MB' : 'MP4, WebM · Up to 100MB'
                                        }
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setShowForm(false)}
                                className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
                                Cancel
                            </button>
                            <button disabled={uploading || (uploadType !== 'video_link' && !file) || (uploadType === 'video_link' && !videoLinkUrl.trim())}
                                type="submit"
                                className="px-6 py-2.5 bg-primary-600 dark:bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2 text-sm shadow-sm">
                                {uploading
                                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                                    : <><Plus size={16} /> Publish Media</>
                                }
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Media Library Grid */}
            {loading ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading media library...</div>
            ) : (
                <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-white/10">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Media Library</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{filtered.length} item{filtered.length !== 1 ? 's' : ''} · Gallery images, uploaded videos, and linked videos.</p>
                    </div>

                    {filtered.length === 0 ? (
                        <EmptyState title="No media found" message={search || filter !== 'ALL' ? 'Try adjusting your filters.' : 'Upload your first image or video to get started.'}
                            icon={ImageIcon} action={!search && filter === 'ALL' ? { label: 'Upload Media', onClick: () => setShowForm(true) } : undefined} />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-100 dark:bg-white/5">
                            {filtered.map(item => (
                                <div key={`${item.source}-${item.id}`} className="bg-white dark:bg-[#111827] p-4 group">
                                    {/* Thumbnail */}
                                    <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3 relative">
                                        {item.mediaType === 'image' ? (
                                            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                        ) : item.mediaType === 'video' && isVideoUrl(item.url) ? (
                                            <video src={item.url} className="w-full h-full object-cover" preload="metadata" />
                                        ) : item.mediaType === 'video_link' && getEmbedUrl(item.url) ? (
                                            <iframe src={getEmbedUrl(item.url)!} className="w-full h-full pointer-events-none" loading="lazy" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <Video size={32} />
                                            </div>
                                        )}
                                        {/* Type Badge */}
                                        <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                                            item.mediaType === 'image'
                                                ? 'bg-blue-500/80 text-white'
                                                : item.mediaType === 'video'
                                                    ? 'bg-purple-500/80 text-white'
                                                    : 'bg-amber-500/80 text-white'
                                        }`}>
                                            {item.mediaType === 'image' ? <ImageIcon size={10} /> : item.mediaType === 'video' ? <Film size={10} /> : <Link2 size={10} />}
                                            {item.mediaType === 'image' ? 'Image' : item.mediaType === 'video' ? 'Video' : 'Link'}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="space-y-1.5">
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{item.title}</h3>
                                        {item.description && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{item.description}</p>
                                        )}
                                        <div className="flex items-center justify-between pt-1">
                                            <div className="flex items-center gap-2">
                                                {item.category !== 'General' && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">
                                                        {item.category}
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-slate-400">{formatDate(item.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                                <a href={item.url} target="_blank" rel="noreferrer"
                                                    className="p-1.5 text-slate-400 hover:text-primary-600 transition rounded" title="Open">
                                                    <ExternalLink size={14} />
                                                </a>
                                                <button onClick={() => confirmDelete(item)} disabled={deleting === item.id}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 transition rounded disabled:opacity-50" title="Delete">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <ActionModal isOpen={modalState !== 'HIDDEN'} state={modalState} title={modalConfig.title} message={modalConfig.message} isDanger={modalConfig.isDanger} confirmText={modalConfig.confirmText} successMessage={modalConfig.successMessage} onConfirm={executeAction} onClose={() => setModalState('HIDDEN')} />
        </div>
    );
};

export default MediaHubTab;
