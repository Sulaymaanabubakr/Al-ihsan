import React, { useEffect, useState } from 'react';
import { getDonations, createDonation, verifyDonation, type DonationRecord, type DonationInput, type PaymentMethod } from '../../lib/donationService';
import { getDonors, type DonorRecord } from '../../lib/donorService';
import { getCampaigns, type CampaignRecord } from '../../lib/campaignService';
import StatusBadge from '../../components/admin/StatusBadge';
import EmptyState from '../../components/admin/EmptyState';
import { formatNaira } from '../../components/admin/CurrencyDisplay';
import FormField from '../../components/admin/FormField';
import { Download, Plus, X, Search, CheckCircle, Banknote } from 'lucide-react';

const formatDate = (v: string) => new Date(v).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'PAYSTACK', label: 'Paystack' },
    { value: 'CASH', label: 'Cash' },
    { value: 'OTHER', label: 'Other' },
];

const DonationsTab: React.FC = () => {
    const [donations, setDonations] = useState<DonationRecord[]>([]);
    const [donors, setDonors] = useState<DonorRecord[]>([]);
    const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<DonationInput>({ donorName: '', amount: 0, paymentMethod: 'BANK_TRANSFER' });

    useEffect(() => { void load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            const [d, dn, c] = await Promise.all([getDonations(), getDonors(), getCampaigns()]);
            setDonations(d);
            setDonors(dn);
            setCampaigns(c);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.donorName || !form.amount) return;
        await createDonation(form);
        setShowForm(false);
        setForm({ donorName: '', amount: 0, paymentMethod: 'BANK_TRANSFER' });
        await load();
    };

    const handleVerify = async (id: string, verified: boolean) => {
        await verifyDonation(id, verified);
        setDonations(prev => prev.map(d => d.id === id ? { ...d, verified } : d));
    };

    const exportCsv = () => {
        const headers = ['Date', 'Donor', 'Amount', 'Method', 'Reference', 'Verified'];
        const rows = filtered.map(d => [formatDate(d.donatedAt), d.donorName, d.amount, d.paymentMethod, d.reference, d.verified ? 'Yes' : 'No']);
        const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'donations.csv';
        link.click();
    };

    const filtered = donations.filter(d => d.donorName.toLowerCase().includes(search.toLowerCase()) || d.reference.toLowerCase().includes(search.toLowerCase()));
    const total = donations.reduce((s, d) => s + d.amount, 0);

    if (loading) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading donations...</div>;

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#111827] p-5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Donations</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">{formatNaira(total)}</p>
                </div>
                <div className="bg-white dark:bg-[#111827] p-5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Records</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{donations.length}</p>
                </div>
                <div className="bg-white dark:bg-[#111827] p-5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Verified</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{donations.filter(d => d.verified).length}</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by donor or reference..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1F2937] text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400" />
                </div>
                <div className="flex gap-2">
                    <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50 rounded-lg font-medium text-sm hover:bg-emerald-100 transition">
                        <Download size={16} /> Export
                    </button>
                    <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg font-medium text-sm hover:bg-primary-700 transition shadow-sm">
                        <Plus size={16} /> Record Donation
                    </button>
                </div>
            </div>

            {/* New Donation Form */}
            {showForm && (
                <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-white/10 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Record New Donation</h3>
                        <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
                        <FormField label="Donor Name" name="donorName" value={form.donorName} onChange={e => setForm(p => ({ ...p, donorName: e.target.value }))} required />
                        <FormField label="Amount (₦)" name="amount" type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: Number(e.target.value) }))} required prefix="₦" />
                        <FormField label="Payment Method" name="paymentMethod" type="select" value={form.paymentMethod} onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value as PaymentMethod }))} options={PAYMENT_METHODS} />
                        <FormField label="Reference" name="reference" value={form.reference || ''} onChange={e => setForm(p => ({ ...p, reference: e.target.value }))} placeholder="Transaction ref or receipt #" />
                        <FormField label="Campaign (optional)" name="campaignId" type="select" value={form.campaignId || ''} onChange={e => setForm(p => ({ ...p, campaignId: e.target.value || undefined }))} options={[{ value: '', label: '— No campaign —' }, ...campaigns.map(c => ({ value: c.id, label: c.title }))]} />
                        <FormField label="Notes" name="notes" value={form.notes || ''} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
                        <div className="sm:col-span-2 flex justify-end">
                            <button type="submit" className="px-6 py-2.5 bg-primary-600 dark:bg-primary-500 text-white rounded-lg font-medium text-sm hover:bg-primary-700 transition shadow-sm">Save Donation</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {filtered.length === 0 ? (
                        <EmptyState title="No donations recorded" message="Record your first donation to get started." icon={Banknote} action={{ label: 'Record Donation', onClick: () => setShowForm(true) }} />
                    ) : filtered.map(d => (
                        <div key={d.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-slate-900 dark:text-white">{d.donorName}</h3>
                                    {d.verified && <CheckCircle size={14} className="text-emerald-500" />}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {d.paymentMethod.replace('_', ' ')} · {d.reference || 'No ref'} · {formatDate(d.donatedAt)}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{formatNaira(d.amount)}</p>
                                <button onClick={() => handleVerify(d.id, !d.verified)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${d.verified ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-blue-100 hover:text-blue-700'}`}>
                                    {d.verified ? 'Verified' : 'Verify'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DonationsTab;
