import React, { useEffect, useState } from 'react';
import { getCampaigns, createCampaign, updateCampaign, type CampaignRecord, type CampaignInput, type CampaignStatus } from '../../lib/campaignService';
import StatusBadge from '../../components/admin/StatusBadge';
import EmptyState from '../../components/admin/EmptyState';
import { formatNaira } from '../../components/admin/CurrencyDisplay';
import FormField from '../../components/admin/FormField';
import { Plus, X, Target, Calendar } from 'lucide-react';

const STATUS_OPTIONS: { value: CampaignStatus; label: string }[] = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
];

const CampaignsTab: React.FC = () => {
    const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<CampaignInput>({ title: '', targetAmount: 0, description: '', status: 'DRAFT' });

    useEffect(() => { void load(); }, []);

    const load = async () => {
        setLoading(true);
        try { setCampaigns(await getCampaigns()); } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title) return;
        await createCampaign(form);
        setShowForm(false);
        setForm({ title: '', targetAmount: 0, description: '', status: 'DRAFT' });
        await load();
    };

    const handleStatusChange = async (id: string, status: CampaignStatus) => {
        await updateCampaign(id, { status });
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    };

    if (loading) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading campaigns...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{campaigns.filter(c => c.status === 'ACTIVE').length} active campaigns</p>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg font-medium text-sm hover:bg-primary-700 transition shadow-sm">
                    <Plus size={16} /> New Campaign
                </button>
            </div>

            {showForm && (
                <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-white/10 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create Campaign</h3>
                        <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-4">
                        <FormField label="Title" name="title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                        <FormField label="Target Amount (₦)" name="targetAmount" type="number" value={form.targetAmount} onChange={e => setForm(p => ({ ...p, targetAmount: Number(e.target.value) }))} required prefix="₦" />
                        <FormField label="Deadline" name="deadline" type="date" value={form.deadline || ''} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
                        <FormField label="Status" name="status" type="select" value={form.status || 'DRAFT'} onChange={e => setForm(p => ({ ...p, status: e.target.value as CampaignStatus }))} options={STATUS_OPTIONS} />
                        <div className="sm:col-span-2">
                            <FormField label="Description" name="description" type="textarea" value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} />
                        </div>
                        <div className="sm:col-span-2 flex justify-end">
                            <button type="submit" className="px-6 py-2.5 bg-primary-600 dark:bg-primary-500 text-white rounded-lg font-medium text-sm hover:bg-primary-700 transition shadow-sm">Create Campaign</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {campaigns.length === 0 ? (
                    <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                        <EmptyState title="No campaigns" message="Create your first campaign to start fundraising." icon={Target} action={{ label: 'Create Campaign', onClick: () => setShowForm(true) }} />
                    </div>
                ) : campaigns.map(c => {
                    const pct = c.targetAmount > 0 ? Math.min(100, Math.round((c.amountRaised / c.targetAmount) * 100)) : 0;
                    return (
                        <div key={c.id} className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-white/10 shadow-sm p-6">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{c.title}</h3>
                                        <StatusBadge status={c.status} />
                                    </div>
                                    {c.description && <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{c.description}</p>}

                                    {/* Progress */}
                                    <div className="mb-3">
                                        <div className="flex justify-between text-sm mb-1.5">
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatNaira(c.amountRaised)}</span>
                                            <span className="text-slate-500 dark:text-slate-400">of {formatNaira(c.targetAmount)}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                                            <div className="bg-gradient-to-r from-primary-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">{pct}% funded</p>
                                    </div>

                                    {c.deadline && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                            <Calendar size={12} /> Deadline: {new Date(c.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 lg:flex-col">
                                    {STATUS_OPTIONS.map(s => (
                                        <button key={s.value} onClick={() => handleStatusChange(c.id, s.value)} disabled={c.status === s.value}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-30 ${c.status === s.value ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}>
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CampaignsTab;
