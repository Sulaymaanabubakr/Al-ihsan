import React, { useState, useEffect } from 'react';
import {
    registerStudent,
    subscribeToProgramSettings,
    initializeProgramSettings,
    type ProgramSettings,
    type RegistrationData,
    type RegistrationType
} from '../../lib/registrationService';
import { Loader2, CheckCircle, AlertCircle, Users, Trophy } from 'lucide-react';

const RegistrationForm: React.FC = () => {
    const [settings, setSettings] = useState<ProgramSettings | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [registrationType, setRegistrationType] = useState<RegistrationType | null>(null);
    const [formData, setFormData] = useState<Partial<RegistrationData>>({
        city: '',
        state: '',
        activity: 'General Attendance'
    });

    useEffect(() => {
        // Attempt initialization on mount to ensure document exists
        const init = async () => {
            try {
                await initializeProgramSettings();
            } catch (e) {
                console.error("Failed to init settings", e);
            }
        };
        init();

        const unsubscribe = subscribeToProgramSettings((data) => {
            setSettings(data);
        });
        return () => unsubscribe();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!registrationType) {
            setError("Please select a registration type.");
            setLoading(false);
            return;
        }

        try {
            await registerStudent({
                childName: formData.childName!,
                age: Number(formData.age),
                gender: formData.gender!,
                parentName: formData.parentName!,
                phone: formData.phone!,
                whatsapp: formData.whatsapp!,
                email: formData.email!,
                city: formData.city!,
                state: formData.state!,
                type: registrationType,
                activity: formData.activity!,
                experience: formData.experience,
                notes: formData.notes
            } as RegistrationData);

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Fallback settings to ensure UI shows even if loading fails/is slow
    const effectiveSettings = settings || {
        is_registration_open: true,
        general_limit: 80,
        general_slots_taken: 0,
        competition_limit: 20,
        competition_slots_taken: 0
    };

    // Check if we are truly loading (no data AND just mounted?) 
    // Actually, we prefer showing the UI with 0 counts than a spinner forever if firestore fails.
    // So we proceed with effectiveSettings.

    const generalRemaining = effectiveSettings.general_limit - effectiveSettings.general_slots_taken;
    const competitionRemaining = effectiveSettings.competition_limit - effectiveSettings.competition_slots_taken;
    const isGlobalClosed = !effectiveSettings.is_registration_open || (generalRemaining <= 0 && competitionRemaining <= 0);

    if (success) {
        return (
            <div className="bg-primary-50 border border-primary-200 rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-sm">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-primary-800 mb-2">Registration Successful!</h3>
                <p className="text-primary-700 mb-6">
                    Jazakumullahu Khairan! Your child has been pending registration for the Ramadan Teens Program.
                    We have sent the details to our admin team for review. You will receive an official confirmation shortly.
                </p>
                <button
                    onClick={() => {
                        setSuccess(false);
                        setRegistrationType(null);
                        setFormData({ city: '', state: '', activity: 'General Attendance' });
                    }}
                    className="px-6 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition"
                >
                    Register Another Child
                </button>
            </div>
        );
    }

    if (isGlobalClosed) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-6 max-w-2xl mx-auto flex items-start gap-4 shadow-sm">
                <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
                <div>
                    <h3 className="text-xl font-bold text-red-800 mb-2">Registration Closed</h3>
                    <p className="text-red-700">
                        SubhanAllah! All slots for the Ramadan Teens Program have been filled.
                        Please follow our social media channels for any potential waiting list announcements or future programs.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Type Selection */}
            {!registrationType ? (
                <>
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-6 text-center">
                        <p className="text-red-600 font-bold text-sm">
                            * Note: A child can ONLY enroll for ONE activity type.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* General Attendance Option */}
                        <div
                            onClick={() => generalRemaining > 0 && setRegistrationType('GENERAL')}
                            className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden text-center md:text-left
                    ${generalRemaining > 0
                                    ? 'border-gray-200 hover:border-primary-500 hover:shadow-xl bg-white'
                                    : 'border-gray-100 bg-gray-50 opacity-70 cursor-not-allowed'}`}
                        >
                            <div className="absolute top-4 right-4 bg-primary-100 text-primary-800 text-xs font-bold px-3 py-1 rounded-full">
                                {generalRemaining > 0 ? `${generalRemaining} Slots Left` : 'FULL'}
                            </div>
                            <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-6 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                                <Users className="w-7 h-7 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-bold text-primary-900 mb-2">General Attendance</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                For teens attending the program activities only (Tafsir, History, etc.) without participating in competitions.
                            </p>
                            {generalRemaining > 0 && (
                                <div className="mt-6 flex items-center justify-center md:justify-start text-primary-600 font-semibold group-hover:translate-x-1 transition-transform">
                                    Select Option →
                                </div>
                            )}
                        </div>

                        {/* Competition Option */}
                        <div
                            onClick={() => competitionRemaining > 0 && setRegistrationType('COMPETITION')}
                            className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden text-center md:text-left
                    ${competitionRemaining > 0
                                    ? 'border-gray-200 hover:border-gold-500 hover:shadow-xl bg-white'
                                    : 'border-gray-100 bg-gray-50 opacity-70 cursor-not-allowed'}`}
                        >
                            <div className="absolute top-4 right-4 bg-gold-100 text-gold-800 text-xs font-bold px-3 py-1 rounded-full">
                                {competitionRemaining > 0 ? `${competitionRemaining} Slots Left` : 'FULL'}
                            </div>
                            <div className="w-14 h-14 bg-gold-100 rounded-xl flex items-center justify-center mb-6 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                                <Trophy className="w-7 h-7 text-gold-600" />
                            </div>
                            <h3 className="text-xl font-bold text-primary-900 mb-2">Competition Registration</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Strictly for participants in the Qur'an or Quiz Competition. Limited availability for serious contenders.
                            </p>
                            {competitionRemaining > 0 && (
                                <div className="mt-6 flex items-center justify-center md:justify-start text-gold-600 font-semibold group-hover:translate-x-1 transition-transform">
                                    Select Option →
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-primary-900 p-6 flex justify-between items-center text-white">
                        <div>
                            <h2 className="text-xl font-bold text-center md:text-left">
                                {registrationType === 'GENERAL' ? 'General Program Registration' : 'Competition Entry Form'}
                            </h2>
                            <p className="text-primary-200 text-sm mt-1 text-center md:text-left">Please fill in all details correctly.</p>
                        </div>
                        <button
                            onClick={() => {
                                setRegistrationType(null);
                                setFormData({ ...formData, activity: 'General Attendance' });
                                setError(null);
                            }}
                            className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
                        >
                            Change Type
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Child's Full Name</label>
                                <input required name="childName" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" placeholder="e.g. Abdullah Yusuf" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Age</label>
                                    <input required type="number" name="age" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" placeholder="13" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Gender</label>
                                    <select required name="gender" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition">
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Parent/Guardian Name</label>
                            <input required name="parentName" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" placeholder="Parent's full name" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <input required type="tel" name="phone" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" placeholder="+234..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">WhatsApp Number</label>
                                <input required type="tel" name="whatsapp" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" placeholder="+234..." />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <input required type="email" name="email" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" placeholder="email@example.com" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">City</label>
                                <input required name="city" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" placeholder="e.g. Ikeja" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">State</label>
                                <input required name="state" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" placeholder="e.g. Lagos" />
                            </div>
                        </div>

                        {registrationType === 'COMPETITION' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Select Competition</label>
                                <select required name="activity" onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border-2 border-gold-200 bg-gold-50 text-gold-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition">
                                    <option value="">Select Category...</option>
                                    <option value="Qur'an Competition">Qur'an Competition</option>
                                    <option value="Quiz Competition">Quiz Competition</option>
                                </select>
                                <p className="text-xs text-gold-700">
                                    Note: You can only register for ONE competition category.
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Previous Experience (Optional)</label>
                            <textarea name="experience" onChange={handleInputChange} rows={2} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" placeholder="Any previous competition wins or relevant experience?" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Additional Notes (Optional)</label>
                            <textarea name="notes" onChange={handleInputChange} rows={2} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" placeholder="Any medical conditions or special requests?" />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary-900 text-white rounded-xl font-bold text-lg hover:bg-primary-800 transition shadow-lg hover:shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (registrationType === 'COMPETITION' ? 'Submit Competition Entry' : 'Complete Registration')}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default RegistrationForm;
