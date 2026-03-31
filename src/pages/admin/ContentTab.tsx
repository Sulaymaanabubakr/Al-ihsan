import React, { useEffect, useState } from 'react';
import { getContentPosts, createContentPost, updateContentPost, deleteContentPost, type ContentPost, type ContentInput, type ContentStatus } from '../../lib/contentService';
import StatusBadge from '../../components/admin/StatusBadge';
import EmptyState from '../../components/admin/EmptyState';
import FormField from '../../components/admin/FormField';
import { Plus, X, FileText, Trash2, Eye, EyeOff } from 'lucide-react';

const formatDate = (v: string) => new Date(v).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const ContentTab: React.FC = () => {
    const [posts, setPosts] = useState<ContentPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<ContentInput>({ title: '', body: '', status: 'DRAFT' });

    useEffect(() => { void load(); }, []);

    const load = async () => {
        setLoading(true);
        try { setPosts(await getContentPosts()); } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title) return;
        await createContentPost(form);
        setShowForm(false);
        setForm({ title: '', body: '', status: 'DRAFT' });
        await load();
    };

    const handleTogglePublish = async (post: ContentPost) => {
        const newStatus: ContentStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
        await updateContentPost(post.id, { status: newStatus });
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: newStatus, publishedAt: newStatus === 'PUBLISHED' ? new Date().toISOString() : p.publishedAt } : p));
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this post?')) return;
        await deleteContentPost(id);
        setPosts(prev => prev.filter(p => p.id !== id));
    };

    if (loading) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading content...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">{posts.filter(p => p.status === 'PUBLISHED').length} published · {posts.filter(p => p.status === 'DRAFT').length} drafts</p>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg font-medium text-sm hover:bg-primary-700 transition shadow-sm">
                    <Plus size={16} /> New Post
                </button>
            </div>

            {showForm && (
                <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-white/10 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create Post</h3>
                        <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <FormField label="Title" name="title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                        <FormField label="Body" name="body" type="textarea" value={form.body || ''} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} rows={6} />
                        <FormField label="Image URL" name="imageUrl" type="url" value={form.imageUrl || ''} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://..." />
                        <FormField label="Status" name="status" type="select" value={form.status || 'DRAFT'} onChange={e => setForm(p => ({ ...p, status: e.target.value as ContentStatus }))} options={[{ value: 'DRAFT', label: 'Draft' }, { value: 'PUBLISHED', label: 'Published' }]} />
                        <div className="flex justify-end">
                            <button type="submit" className="px-6 py-2.5 bg-primary-600 dark:bg-primary-500 text-white rounded-lg font-medium text-sm hover:bg-primary-700 transition shadow-sm">Create Post</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {posts.length === 0 ? (
                        <EmptyState title="No content" message="Create posts to share updates with your community." icon={FileText} action={{ label: 'New Post', onClick: () => setShowForm(true) }} />
                    ) : posts.map(p => (
                        <div key={p.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-slate-900 dark:text-white">{p.title}</h3>
                                    <StatusBadge status={p.status} />
                                </div>
                                {p.body && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{p.body}</p>}
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{formatDate(p.createdAt)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleTogglePublish(p)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${p.status === 'PUBLISHED' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'}`}>
                                    {p.status === 'PUBLISHED' ? <><EyeOff size={12} /> Unpublish</> : <><Eye size={12} /> Publish</>}
                                </button>
                                <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-400 hover:text-red-600 transition">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContentTab;
