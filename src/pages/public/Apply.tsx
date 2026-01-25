import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCloudinary } from '../../hooks/useCloudinary';
import { Upload, Home, Heart, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const Apply: React.FC = () => {
    const { uploadImage, uploading } = useCloudinary();
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        familySize: '',
        helpType: 'Food Assistance',
        story: '',
        evidenceUrl: ''
    });

    const [file, setFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            let evidenceUrl = '';
            if (file) {
                const result = await uploadImage(file);
                if (result) evidenceUrl = result.url;
            }

            await addDoc(collection(db, 'applications'), {
                ...formData,
                evidenceUrl,
                status: 'pending',
                reviewed: false,
                createdAt: serverTimestamp()
            });

            setSuccess(true);
        } catch (error) {
            console.error("Error submitting application:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Received</h2>
                    <p className="text-gray-600 mb-8">
                        JazakAllah Khair. Your request has been submitted successfully using our secure system. Our team will review your case and contact you soon.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 md:py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-emerald-900 mb-4">Apply for Assistance</h1>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Please fill out this form truthfully. We treat all information with strict confidentiality and emanah using our secure processing system.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Progress Bar */}
                    <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center text-sm font-medium text-gray-500">
                        <span className={step >= 1 ? "text-emerald-600" : ""}>1. Personal Details</span>
                        <div className="flex-1 h-1 bg-gray-200 mx-4 rounded-full overflow-hidden">
                            <div className={`h-full bg-emerald-500 transition-all duration-300 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`}></div>
                        </div>
                        <span className={step >= 3 ? "text-emerald-600" : ""}>3. Evidence</span>
                    </div>

                    <div className="p-8 space-y-6">
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Home size={20} className="text-emerald-500" /> Personal Information
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Enter your full name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="080..." />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Address</label>
                                    <input required name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Full residential address" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Family Size (including you)</label>
                                    <input required type="number" name="familySize" value={formData.familySize} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. 5" />
                                </div>
                                <button type="button" onClick={() => setStep(2)} className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 mt-4">Next Step</button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Heart size={20} className="text-emerald-500" /> Your Situation
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type of Assistance Needed</label>
                                    <select name="helpType" value={formData.helpType} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none">
                                        <option>Food Assistance</option>
                                        <option>Medical Support</option>
                                        <option>Education/School Fees</option>
                                        <option>Rent/Housing</option>
                                        <option>Business/Empowerment</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tell us your story</label>
                                    <p className="text-xs text-gray-500 mb-2">Please explain your situation clearly. Why do you need help now?</p>
                                    <textarea required name="story" value={formData.story} onChange={handleChange} rows={6} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Describe your situation..." />
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50">Back</button>
                                    <button type="button" onClick={() => setStep(3)} className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700">Next Step</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <FileText size={20} className="text-emerald-500" /> Evidence
                                </h3>

                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                    <div className="flex gap-2">
                                        <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
                                        <p className="text-sm text-yellow-800">Please upload a photo that supports your request (e.g., Medical report, School bill, ID card, or a photo of your living condition).</p>
                                    </div>
                                </div>

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                                    <input
                                        type="file"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                    />
                                    {file ? (
                                        <div className="text-emerald-600 font-medium flex flex-col items-center">
                                            <CheckCircle size={32} className="mb-2" />
                                            {file.name}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-gray-500">
                                            <Upload size={32} />
                                            <span>Click to upload evidence (Image)</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 mt-8">
                                    <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50">Back</button>
                                    <button
                                        type="submit"
                                        disabled={submitting || uploading}
                                        className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {submitting || uploading ? <Loader2 className="animate-spin" /> : 'Submit Application'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Apply;
