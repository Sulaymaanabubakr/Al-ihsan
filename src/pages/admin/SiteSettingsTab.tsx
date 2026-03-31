import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { updateSiteSettings } from '../../lib/siteSettingsService';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';

const SiteSettingsTab: React.FC = () => {
    const { settings, refreshSettings } = useSiteSettings();
    const [formData, setFormData] = useState(settings);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // Sync form data if settings load late
    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsSaving(true);

        try {
            await updateSiteSettings(formData);
            await refreshSettings();
            setMessage({ text: 'Site settings updated successfully!', type: 'success' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error: any) {
            console.error('Failed to update settings:', error);
            setMessage({ text: error.message || 'Failed to update settings.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-primary-900">Site Settings</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Update global information like contacts, social links, and bank details.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {message && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <p className="font-medium text-sm">{message.text}</p>
                    </div>
                )}

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* General & Contact Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">General & Contact Info</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Footer About Text</label>
                            <textarea
                                name="aboutText"
                                value={formData.aboutText}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Headquarters Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone</label>
                                <input
                                    type="text"
                                    name="phonePrimary"
                                    value={formData.phonePrimary}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Phone</label>
                                <input
                                    type="text"
                                    name="phoneSecondary"
                                    value={formData.phoneSecondary || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Email</label>
                                <input
                                    type="email"
                                    name="emailInfo"
                                    value={formData.emailInfo}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                                <input
                                    type="email"
                                    name="emailSupport"
                                    value={formData.emailSupport || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Dynamic Links */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Social Links</h3>
                            
                            {['facebookUrl', 'instagramUrl', 'twitterUrl', 'linkedinUrl', 'tiktokUrl'].map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                                        {field.replace('Url', '')} Link
                                    </label>
                                    <input
                                        type="url"
                                        name={field}
                                        value={(formData as any)[field] || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder={`https://${field.replace('Url', '')}.com/...`}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Bank Details */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Donation Bank Account</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                                <input
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                                <input
                                    type="text"
                                    name="accountName"
                                    value={formData.accountName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                                <input
                                    type="text"
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-900 text-white rounded-lg font-bold hover:bg-primary-800 transition-colors disabled:opacity-70"
                    >
                        <Save size={20} />
                        {isSaving ? 'Saving...' : 'Save Site Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SiteSettingsTab;
