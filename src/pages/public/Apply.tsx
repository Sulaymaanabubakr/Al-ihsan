import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useCloudinary } from '../../hooks/useCloudinary';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import SEO from '../../components/common/SEO';

const Apply: React.FC = () => {
    const { uploadImage, uploading } = useCloudinary();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        familySize: '',
        helpType: 'food',
        story: '',
        evidenceUrl: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const result = await uploadImage(e.target.files[0]);
            if (result) {
                setFormData({ ...formData, evidenceUrl: result.url });
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'applications'), {
                ...formData,
                status: 'pending',
                createdAt: new Date()
            });
            setIsSuccess(true);
        } catch (error) {
            console.error("Error submitting application:", error);
            alert("Failed to submit. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <SEO title="Application Submitted" description="Your application to Al-Ihsan Relief has been received." />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full border-t-4 border-gold-500"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h2 className="text-3xl font-heading font-bold text-primary-900 mb-4">Alhamdulillah!</h2>
                    <p className="text-gray-600 mb-8">Your application has been received. Our team will review your request and contact you shortly In Shaa Allah.</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full py-3 bg-primary-900 text-white rounded-full font-bold hover:bg-primary-800 transition-colors"
                    >
                        Return Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4">
            <SEO
                title="Get Help"
                description="Apply for assistance explicitly from Al-Ihsan Relief. We offer food, medical, and educational support."
            />
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-heading font-bold text-primary-900 mb-4">Request for Assistance</h1>
                    <p className="text-gray-600">We are here to serve. Please provide accurate details so we can assess your needs properly.</p>
                </div>

                {/* Progress Bar */}
                <div className="flex justify-between mb-8 max-w-md mx-auto relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10"></div>
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-gold-500 -z-10 transition-all duration-500"
                        style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                    ></div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-gold-500 text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>
                            {s}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h3 className="text-xl font-bold text-primary-900 border-b border-gray-100 pb-4">Personal Details</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input required name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" placeholder="e.g. Ibrahim Musa" />
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" placeholder="080..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                        <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" placeholder="Residential Address" />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button type="button" onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-3 bg-primary-900 text-white rounded-full font-bold hover:bg-primary-800 transition-colors">
                                        Next <ChevronRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h3 className="text-xl font-bold text-primary-900 border-b border-gray-100 pb-4">Situation Details</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category of Help Needed</label>
                                        <select name="helpType" value={formData.helpType} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none bg-white">
                                            <option value="food">Food Relief</option>
                                            <option value="medical">Medical Assistance</option>
                                            <option value="education">Education Support</option>
                                            <option value="financial">Financial Aid</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Family Size</label>
                                        <input required type="number" name="familySize" value={formData.familySize} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" placeholder="Number of dependents" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Story</label>
                                    <textarea required name="story" value={formData.story} onChange={handleInputChange} rows={5} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" placeholder="Please explain your situation..." />
                                </div>
                                <div className="flex justify-between pt-4">
                                    <button type="button" onClick={() => setStep(1)} className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium">Back</button>
                                    <button type="button" onClick={() => setStep(3)} className="flex items-center gap-2 px-6 py-3 bg-primary-900 text-white rounded-full font-bold hover:bg-primary-800 transition-colors">
                                        Next <ChevronRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h3 className="text-xl font-bold text-primary-900 border-b border-gray-100 pb-4">Evidence & Submit</h3>
                                <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-800 border border-blue-100">
                                    <AlertCircle className="shrink-0 mt-0.5" />
                                    <p className="text-sm">Please upload any supporting documents (Medical report, School bills, ID card etc.) to help us process your application faster.</p>
                                </div>

                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-white transition-colors cursor-pointer relative">
                                    <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*,.pdf" />
                                    <div className="flex flex-col items-center">
                                        <Upload className={`w-12 h-12 mb-3 ${formData.evidenceUrl ? 'text-green-500' : 'text-gray-400'}`} />
                                        {formData.evidenceUrl ? (
                                            <p className="font-semibold text-green-600">File attached successfully!</p>
                                        ) : (
                                            <>
                                                <p className="font-medium text-gray-700">Click to Upload Evidence</p>
                                                <p className="text-xs text-gray-500 mt-1">{uploading ? 'Uploading...' : 'JPG, PNG, PDF (Max 5MB)'}</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <button type="button" onClick={() => setStep(2)} className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium">Back</button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || uploading}
                                        className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-white rounded-full font-bold hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>
        </div>
    );
};

export default Apply;
