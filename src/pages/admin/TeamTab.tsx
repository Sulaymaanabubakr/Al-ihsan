import React, { useEffect, useState } from 'react';
import { getTeamMembers, updateTeamMemberRole, updateTeamMemberProfile, type TeamMember, type TeamRole } from '../../lib/teamService';
import StatusBadge from '../../components/admin/StatusBadge';
import EmptyState from '../../components/admin/EmptyState';
import { Users, Shield, Save } from 'lucide-react';

const ROLES: { value: TeamRole; label: string; desc: string }[] = [
    { value: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Full access to everything' },
    { value: 'FINANCE', label: 'Finance', desc: 'Donations, donors, expenses, analytics' },
    { value: 'MODERATOR', label: 'Moderator', desc: 'Cases, requests, volunteers, content' },
    { value: 'FIELD_AGENT', label: 'Field Agent', desc: 'Assigned cases and requests' },
];

const TeamTab: React.FC = () => {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ fullName: '', phone: '' });

    useEffect(() => { void load(); }, []);

    const load = async () => {
        setLoading(true);
        try { setMembers(await getTeamMembers()); } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleRoleChange = async (id: string, role: TeamRole) => {
        await updateTeamMemberRole(id, role);
        setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
    };

    const handleEdit = (m: TeamMember) => {
        setEditing(m.id);
        setEditForm({ fullName: m.fullName, phone: m.phone });
    };

    const handleSaveProfile = async (id: string) => {
        await updateTeamMemberProfile(id, editForm);
        setMembers(prev => prev.map(m => m.id === id ? { ...m, ...editForm } : m));
        setEditing(null);
    };

    if (loading) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading team...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-white/10 shadow-sm p-6">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2"><Shield size={16} className="text-slate-400" /> Role Definitions</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                    {ROLES.map(r => (
                        <div key={r.value} className="bg-slate-50 dark:bg-[#1F2937] rounded-xl p-4 border border-transparent dark:border-white/5">
                            <StatusBadge status={r.value} className="mb-2" />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{r.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-white/10">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Team Members</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{members.length} registered admin{members.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {members.length === 0 ? (
                        <EmptyState title="No team members" message="Admin users will appear here once registered." icon={Users} />
                    ) : members.map(m => (
                        <div key={m.id} className="p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-sm">
                                        {m.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        {editing === m.id ? (
                                            <div className="flex items-center gap-2">
                                                <input value={editForm.fullName} onChange={e => setEditForm(p => ({ ...p, fullName: e.target.value }))}
                                                    className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-sm text-slate-900 dark:text-white" placeholder="Name" />
                                                <input value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                                                    className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-sm text-slate-900 dark:text-white" placeholder="Phone" />
                                                <button onClick={() => handleSaveProfile(m.id)} className="p-1 text-emerald-600 hover:text-emerald-700"><Save size={16} /></button>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className="font-bold text-slate-900 dark:text-white cursor-pointer hover:text-primary-600 transition" onClick={() => handleEdit(m)}>{m.fullName}</h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{m.email}{m.phone ? ` · ${m.phone}` : ''}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {ROLES.map(r => (
                                        <button key={r.value} onClick={() => handleRoleChange(m.id, r.value)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${m.role === r.value ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}>
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamTab;
