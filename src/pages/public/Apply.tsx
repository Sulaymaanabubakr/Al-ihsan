import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ChevronRight, CheckCircle, AlertCircle, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useCloudinary } from '../../hooks/useCloudinary';
import SEO from '../../components/common/SEO';
import { useAnimations } from '../../hooks/useAnimations';
import { submitVolunteerApplication } from '../../lib/volunteerApplicationService';

const quizOptions = {
    amanah: [
        {
            value: 'best',
            label: 'Serve with sincerity, amanah, punctuality, and obedience to lawful leadership.',
            score: 100,
        },
        {
            value: 'mid',
            label: 'Help whenever convenient, but personal preference should come first.',
            score: 40,
        },
        {
            value: 'low',
            label: 'Volunteering is mainly for public visibility and networking.',
            score: 0,
        },
    ],
    confidentiality: [
        {
            value: 'best',
            label: 'Protect beneficiary information and report only through approved internal channels.',
            score: 100,
        },
        {
            value: 'mid',
            label: 'Share details with close friends if they promise to keep it private.',
            score: 0,
        },
        {
            value: 'low',
            label: 'Post beneficiary stories online if it helps fundraising, even without consent.',
            score: 0,
        },
    ],
    adab: [
        {
            value: 'best',
            label: 'Show sabr, respect, modesty, and mercy even when under pressure.',
            score: 100,
        },
        {
            value: 'mid',
            label: 'Correct people harshly so operations move faster.',
            score: 0,
        },
        {
            value: 'low',
            label: 'Avoid difficult beneficiaries and only serve easy cases.',
            score: 0,
        },
    ],
};

const privacyHighlights = [
    'Your information will be used only for volunteer screening, safeguarding, onboarding, and internal administration.',
    'Beneficiary records, staff discussions, and case files must remain confidential before, during, and after service.',
    'False declarations, misuse of charity resources, or breach of adab/confidentiality may lead to removal from service.',
];

const Apply: React.FC = () => {
    const { slideInLeft, fadeInUp, scaleIn } = useAnimations();
    const { uploadImage, uploading } = useCloudinary();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        gender: '',
        phone: '',
        email: '',
        city: '',
        state: '',
        address: '',
        occupation: '',
        maritalStatus: 'Single',
        preferredRole: 'Field Support',
        availability: 'Weekends',
        mosqueCommunity: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        experience: '',
        motivation: '',
        scenarioResponse: '',
        documentUrl: '',
        qAmanah: '',
        qConfidentiality: '',
        qAdab: '',
        acceptedTerms: false,
        acceptedPrivacy: false,
        acceptedConfidentiality: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const target = e.target;
        const value =
            target instanceof HTMLInputElement && target.type === 'checkbox'
                ? target.checked
                : target.value;

        setFormData((prev) => ({ ...prev, [target.name]: value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const result = await uploadImage(e.target.files[0]);
            if (result) {
                setFormData((prev) => ({ ...prev, documentUrl: result.url }));
            }
        }
    };

    const age = Number(formData.age);
    const ageEntered = formData.age !== '' && !Number.isNaN(age);
    const isEligibleAge = ageEntered && age >= 22 && age <= 40;
    const isAgeBlocked = ageEntered && !isEligibleAge;

    const quizScore = useMemo(() => {
        const amanahScore =
            quizOptions.amanah.find((option) => option.value === formData.qAmanah)?.score || 0;
        const confidentialityScore =
            quizOptions.confidentiality.find(
                (option) => option.value === formData.qConfidentiality
            )?.score || 0;
        const adabScore =
            quizOptions.adab.find((option) => option.value === formData.qAdab)?.score || 0;

        return Math.round((amanahScore + confidentialityScore + adabScore) / 3);
    }, [formData.qAdab, formData.qAmanah, formData.qConfidentiality]);

    const goToNextStep = () => {
        if (step === 1 && !isEligibleAge) {
            setError(
                'Volunteer applicants must be between 22 and 40 years old to continue.'
            );
            return;
        }

        setError('');
        setStep((prev) => prev + 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isEligibleAge) {
            setError('You are not eligible for this volunteer intake because the age bracket is 22 to 40.');
            return;
        }

        if (
            !formData.acceptedTerms ||
            !formData.acceptedPrivacy ||
            !formData.acceptedConfidentiality
        ) {
            setError('You must accept the volunteer terms, privacy policy, and confidentiality undertaking.');
            return;
        }

        setIsSubmitting(true);
        try {
            await submitVolunteerApplication({
                fullName: formData.fullName,
                age,
                gender: formData.gender,
                phone: formData.phone,
                email: formData.email,
                city: formData.city,
                state: formData.state,
                address: formData.address,
                occupation: formData.occupation,
                maritalStatus: formData.maritalStatus,
                preferredRole: formData.preferredRole,
                availability: formData.availability,
                mosqueCommunity: formData.mosqueCommunity,
                emergencyContactName: formData.emergencyContactName,
                emergencyContactPhone: formData.emergencyContactPhone,
                experience: formData.experience,
                motivation: formData.motivation,
                idDocumentUrl: formData.documentUrl || undefined,
                qAmanah: formData.qAmanah,
                qConfidentiality: formData.qConfidentiality,
                qAdab: formData.qAdab,
                scenarioResponse: formData.scenarioResponse,
                quizScore,
                acceptedTerms: formData.acceptedTerms,
                acceptedPrivacy: formData.acceptedPrivacy,
                acceptedConfidentiality: formData.acceptedConfidentiality,
            });
            setIsSuccess(true);
        } catch (error) {
            console.error('Error submitting volunteer application:', error);
            setError('Failed to submit your volunteer application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <SEO title="Volunteer Application Submitted" description="Your volunteer application to Al-Ihsan Relief has been received." />
                <motion.div
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full border-t-4 border-gold-500"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h2 className="text-3xl font-heading font-bold text-primary-900 mb-4">Alhamdulillah!</h2>
                    <p className="text-gray-600 mb-8">
                        Your volunteer application has been received. Our team will review your readiness, contact references if needed, and reach out In Shaa Allah.
                    </p>
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
                title="Volunteer With Us"
                description="Apply to serve as a volunteer with Al-Ihsan Relief. Screening includes eligibility, readiness questions, and acceptance of safeguarding and confidentiality terms."
            />
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <motion.h1 variants={slideInLeft} initial="hidden" animate="visible" className="text-4xl font-heading font-bold text-primary-900 mb-4">Volunteer Application</motion.h1>
                    <motion.p variants={fadeInUp} initial="hidden" animate="visible" className="text-gray-600">
                        Serve with ihsan, amanah, and mercy. This form screens applicants for volunteer service in an Islamic charity setting.
                    </motion.p>
                </div>

                {/* Progress Bar */}
                <motion.div
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    className="flex justify-between mb-8 max-w-md mx-auto relative"
                >
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
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100"
                >
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h3 className="text-xl font-bold text-primary-900 border-b border-gray-100 pb-4">Eligibility & Personal Details</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input required name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" placeholder="e.g. Ibrahim Musa" />
                                </div>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                                        <input required type="number" min={18} name="age" value={formData.age} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-lg border outline-none ${isAgeBlocked ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-2 focus:ring-gold-500'}`} placeholder="22 - 40" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                        <select required name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none bg-white">
                                            <option value="">Select gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" placeholder="080..." />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" placeholder="you@example.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                        <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" placeholder="Residential Address" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                        <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" placeholder="Ibadan" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                        <input required name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" placeholder="Oyo State" />
                                    </div>
                                </div>

                                {isAgeBlocked && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-left">
                                        <p className="font-bold text-amber-800 mb-2">Volunteer intake is limited to ages 22 to 40.</p>
                                        <p className="text-amber-700 text-sm">
                                            You are not eligible for this intake cycle. May Allah bless you, reward your intention to serve, increase you in goodness, and open other doors of khayr for you. Please keep supporting the work through dua, dawah, donations, and community encouragement.
                                        </p>
                                    </div>
                                )}

                                <div className="flex justify-end pt-4">
                                    <button type="button" onClick={goToNextStep} disabled={isAgeBlocked} className="flex items-center gap-2 px-6 py-3 bg-primary-900 text-white rounded-full font-bold hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
                                <h3 className="text-xl font-bold text-primary-900 border-b border-gray-100 pb-4">Volunteer Background</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Volunteer Role</label>
                                        <select name="preferredRole" value={formData.preferredRole} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none bg-white">
                                            <option value="Field Support">Field Support</option>
                                            <option value="Beneficiary Intake">Beneficiary Intake</option>
                                            <option value="Logistics & Distribution">Logistics & Distribution</option>
                                            <option value="Admin & Data Support">Admin & Data Support</option>
                                            <option value="Media & Communications">Media & Communications</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                                        <select name="availability" value={formData.availability} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none bg-white">
                                            <option value="Weekends">Weekends</option>
                                            <option value="Weekdays">Weekdays</option>
                                            <option value="Flexible">Flexible</option>
                                            <option value="Event Based">Event Based</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                                        <input required name="occupation" value={formData.occupation} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" placeholder="Teacher, business owner, student..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                                        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none bg-white">
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                            <option value="Divorced">Divorced</option>
                                            <option value="Widowed">Widowed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Mosque / Community Reference</label>
                                        <input required name="mosqueCommunity" value={formData.mosqueCommunity} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" placeholder="Masjid name or community leader" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                                        <input required name="emergencyContactName" value={formData.emergencyContactName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" placeholder="Emergency contact" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
                                    <input required name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" placeholder="+234..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Previous Volunteer / Community Experience</label>
                                    <textarea required name="experience" value={formData.experience} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" placeholder="Describe your past volunteering, dawah, relief, teaching, admin, or community service experience." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to volunteer with Al-Ihsan?</label>
                                    <textarea required name="motivation" value={formData.motivation} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" placeholder="Tell us about your intention, sense of service, and what kind of responsibility you are ready for." />
                                </div>
                                <div className="flex justify-between pt-4">
                                    <button type="button" onClick={() => setStep(1)} className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium">Back</button>
                                    <button type="button" onClick={goToNextStep} className="flex items-center gap-2 px-6 py-3 bg-primary-900 text-white rounded-full font-bold hover:bg-primary-800 transition-colors">
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
                                <h3 className="text-xl font-bold text-primary-900 border-b border-gray-100 pb-4">Readiness Test, Terms & Submit</h3>
                                <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-800 border border-blue-100">
                                    <AlertCircle className="shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                        This volunteer role requires amanah, good adab, and strict confidentiality. Answer the readiness questions honestly and review the compliance terms carefully.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">1. A Muslim volunteer in a charity should primarily...</label>
                                        <select required name="qAmanah" value={formData.qAmanah} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none bg-white">
                                            <option value="">Select your answer</option>
                                            {quizOptions.amanah.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">2. If you receive sensitive beneficiary information, you should...</label>
                                        <select required name="qConfidentiality" value={formData.qConfidentiality} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none bg-white">
                                            <option value="">Select your answer</option>
                                            {quizOptions.confidentiality.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">3. Good adab while serving means you should...</label>
                                        <select required name="qAdab" value={formData.qAdab} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none bg-white">
                                            <option value="">Select your answer</option>
                                            {quizOptions.adab.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
                                        <p className="text-sm text-primary-700 font-semibold">
                                            Current readiness score: {quizScore}%
                                        </p>
                                        <p className="text-xs text-primary-600 mt-1">
                                            This is for screening support only. Admin will still review your written response and application as a whole.
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Scenario Response</label>
                                        <textarea required name="scenarioResponse" value={formData.scenarioResponse} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" placeholder="A beneficiary becomes upset in public and asks you to reveal details of another family's case. What do you do, and why?" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Optional ID / reference document</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-white transition-colors cursor-pointer relative">
                                        <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*,.pdf" />
                                        <div className="flex flex-col items-center">
                                            <Upload className={`w-12 h-12 mb-3 ${formData.documentUrl ? 'text-green-500' : 'text-gray-400'}`} />
                                            {formData.documentUrl ? (
                                                <p className="font-semibold text-green-600">Document attached successfully!</p>
                                            ) : (
                                                <>
                                                    <p className="font-medium text-gray-700">Click to Upload Supporting Document</p>
                                                    <p className="text-xs text-gray-500 mt-1">{uploading ? 'Uploading...' : 'JPG, PNG, PDF (Max 5MB)'}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="text-primary-700" />
                                        <h4 className="text-lg font-bold text-primary-900">Volunteer Terms, Privacy & Confidentiality</h4>
                                    </div>
                                    <div className="space-y-3 text-sm text-gray-700">
                                        {privacyHighlights.map((item) => (
                                            <p key={item} className="leading-relaxed">
                                                {item}
                                            </p>
                                        ))}
                                        <p className="leading-relaxed">
                                            By applying, you confirm that you will obey lawful instructions, safeguard charity property, avoid exploiting beneficiaries, maintain Islamic character, and report concerns through official channels only.
                                        </p>
                                    </div>
                                    <div className="space-y-3 pt-2">
                                        <label className="flex items-start gap-3 text-sm text-gray-700">
                                            <input type="checkbox" name="acceptedTerms" checked={formData.acceptedTerms} onChange={handleInputChange} className="mt-1" />
                                            <span>I have read and accept the volunteer terms, code of conduct, and safeguarding expectations.</span>
                                        </label>
                                        <label className="flex items-start gap-3 text-sm text-gray-700">
                                            <input type="checkbox" name="acceptedPrivacy" checked={formData.acceptedPrivacy} onChange={handleInputChange} className="mt-1" />
                                            <span>I consent to the collection and internal processing of my data for volunteer screening and administration.</span>
                                        </label>
                                        <label className="flex items-start gap-3 text-sm text-gray-700">
                                            <input type="checkbox" name="acceptedConfidentiality" checked={formData.acceptedConfidentiality} onChange={handleInputChange} className="mt-1" />
                                            <span>I understand that beneficiary information is confidential and I must not disclose it without authorization.</span>
                                        </label>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                                        {error}
                                    </div>
                                )}

                                <div className="flex justify-between pt-4">
                                    <button type="button" onClick={() => setStep(2)} className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium">Back</button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || uploading}
                                        className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-white rounded-full font-bold hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Volunteer Application'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.form>

                <div className="mt-8 bg-primary-900 text-white rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <HeartHandshake className="text-gold-400" />
                        <h3 className="text-xl font-bold">What we expect from our volunteers</h3>
                    </div>
                    <p className="text-primary-100 text-sm leading-relaxed">
                        Volunteers represent an Islamic charity before Allah and before the people. We expect punctuality, humility, respect for leadership, truthful communication, mercy toward beneficiaries, and disciplined handling of sensitive information.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Apply;
