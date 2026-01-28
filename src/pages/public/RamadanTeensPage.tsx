import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, BookOpen, Trophy, Shield, CheckCircle, AlertTriangle, Star } from 'lucide-react';
import CountdownTimer from '../../components/ramadan/CountdownTimer';
import RegistrationForm from '../../components/ramadan/RegistrationForm';
import SEO from '../../components/common/SEO';

const RamadanTeensPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            <SEO
                title="Ramadan Teens Program Registration"
                description="Register for the Al-Ihsan Ramadan Teens Program 2026. Empowering the next generation through Islamic knowledge, discipline, and brotherhood."
            />

            {/* Hero Section */}
            <div className="relative bg-primary-950 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-primary-900/50 to-primary-950/90"></div>

                <div className="container mx-auto px-6 py-16 md:py-24 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 font-bold tracking-widest text-sm uppercase mb-6">
                            Ramadan 1447 AH / 2026
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight text-white">
                            Ramadan Teens <br /> <span className="text-gold-500">Program</span>
                        </h1>
                        <p className="text-lg md:text-xl text-primary-200 max-w-3xl mx-auto leading-relaxed">
                            Organized by Al-Ihsan Relief and Empowerment. A focused program for teens emphasizing Islamic knowledge,
                            Qur'an engagement, character building, discipline, and healthy competition in a faith-based environment.
                        </p>
                    </motion.div>

                    <CountdownTimer targetDate="2026-03-05T00:00:00" />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 -mt-8 relative z-20">
                <div className="grid grid-cols-3 gap-2 md:gap-6">
                    <div className="bg-white p-3 md:p-6 rounded-xl shadow-lg border-b-4 border-gold-500 flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 text-center md:text-left">
                        <div className="p-2 md:p-3 bg-gold-100 text-gold-600 rounded-lg shrink-0">
                            <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-xs md:text-lg text-primary-900 leading-tight">Date</h3>
                            <p className="text-gray-600 text-[10px] md:text-sm leading-tight md:mt-1">March 5th, 2026</p>
                        </div>
                    </div>
                    <div className="bg-white p-3 md:p-6 rounded-xl shadow-lg border-b-4 border-primary-500 flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 text-center md:text-left">
                        <div className="p-2 md:p-3 bg-primary-100 text-primary-600 rounded-lg shrink-0">
                            <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-xs md:text-lg text-primary-900 leading-tight">Location</h3>
                            <p className="text-gray-600 text-[10px] md:text-sm leading-tight md:mt-1">Al-Ihsan Center</p>
                        </div>
                    </div>
                    <div className="bg-white p-3 md:p-6 rounded-xl shadow-lg border-b-4 border-gold-500 flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 text-center md:text-left">
                        <div className="p-2 md:p-3 bg-gold-100 text-gold-600 rounded-lg shrink-0">
                            <Users className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-xs md:text-lg text-primary-900 leading-tight">Eligibility</h3>
                            <p className="text-gray-600 text-[10px] md:text-sm leading-tight md:mt-1">Teens (13-19)</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Program Details Column (Left - 7 cols) */}
                    <div className="lg:col-span-7 space-y-12">

                        {/* Activities */}
                        <section>
                            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 mb-6 text-center md:text-left">
                                <div className="p-2 bg-primary-100 rounded-lg text-primary-700">
                                    <BookOpen size={24} />
                                </div>
                                <h2 className="text-3xl font-heading font-bold text-primary-900">Activities</h2>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <p className="text-gray-600 mb-6 text-center md:text-left">
                                    Our program features a diverse range of spiritually enriching and educational activities.
                                </p>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {[
                                        "Ramadan Tafsir Sessions",
                                        "Qur'an Gallery (Exhibition)",
                                        "Qur'an Competition",
                                        "Quiz Competition",
                                        "Islamic History Sessions",
                                        "Character Building Workshops"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-center md:justify-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0" />
                                            <span className="text-gray-800 font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Competitions & Prizes */}
                        <section>
                            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 mb-6 text-center md:text-left">
                                <div className="p-2 bg-gold-100 rounded-lg text-gold-700">
                                    <Trophy size={24} />
                                </div>
                                <h2 className="text-3xl font-heading font-bold text-primary-900">Competitions & Prizes</h2>
                            </div>

                            <div className="space-y-6">
                                {/* Qur'an Competition */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-bold text-primary-900 mb-4 flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 text-center md:text-left">
                                        <span className="w-8 h-1 md:w-2 md:h-8 bg-gold-500 rounded-full"></span>
                                        Qur'an Competition
                                    </h3>

                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div className="bg-primary-50 p-4 rounded-xl text-center md:text-left">
                                            <h4 className="font-bold text-primary-800 mb-2 text-sm uppercase tracking-wider">Requirements</h4>
                                            <ul className="text-sm space-y-2 text-gray-700">
                                                <li className="flex gap-2 justify-center md:justify-start text-center md:text-left"><div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-1.5 shrink-0"></div>Sound and correct Tajweed</li>
                                                <li className="flex gap-2 justify-center md:justify-start text-center md:text-left"><div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-1.5 shrink-0"></div>Proper pronunciation (Makharij)</li>
                                                <li className="flex gap-2 justify-center md:justify-start text-center md:text-left"><div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-1.5 shrink-0"></div>Fluency & Confidence</li>
                                                <li className="flex gap-2 justify-center md:justify-start text-center md:text-left"><div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-1.5 shrink-0"></div>Strong Memorization Accuracy</li>
                                                <li className="flex gap-2 justify-center md:justify-start text-center md:text-left"><div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-1.5 shrink-0"></div>Observance of Islamic Etiquette</li>
                                            </ul>
                                        </div>
                                        <div className="bg-gold-50 p-4 rounded-xl">
                                            <h4 className="font-bold text-gold-800 mb-2 text-sm uppercase tracking-wider">Prizes</h4>
                                            <ul className="space-y-3">
                                                <li className="flex justify-between items-center text-sm font-bold border-b border-gold-200 pb-2">
                                                    <span>1st Place</span> <span className="text-gold-700 text-lg">₦25,000</span>
                                                </li>
                                                <li className="flex justify-between items-center text-sm font-bold border-b border-gold-200 pb-2">
                                                    <span>2nd Place</span> <span className="text-gold-700 text-lg">₦20,000</span>
                                                </li>
                                                <li className="flex justify-between items-center text-sm font-bold">
                                                    <span>3rd Place</span> <span className="text-gold-700 text-lg">₦15,000</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Quiz Competition */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-bold text-primary-900 mb-4 flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 text-center md:text-left">
                                        <span className="w-8 h-1 md:w-2 md:h-8 bg-primary-500 rounded-full"></span>
                                        Quiz Competition
                                    </h3>

                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div className="bg-primary-50 p-4 rounded-xl text-center md:text-left">
                                            <h4 className="font-bold text-primary-800 mb-2 text-sm uppercase tracking-wider">Topics Covered</h4>
                                            <ul className="text-sm space-y-2 text-gray-700">
                                                <li className="flex gap-2 justify-center md:justify-start text-center md:text-left"><div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-1.5 shrink-0"></div>Basic Islamic Knowledge</li>
                                                <li className="flex gap-2 justify-center md:justify-start text-center md:text-left"><div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-1.5 shrink-0"></div>Ramadan Rulings & Virtues</li>
                                                <li className="flex gap-2 justify-center md:justify-start text-center md:text-left"><div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-1.5 shrink-0"></div>Seerah of the Prophet ﷺ</li>
                                                <li className="flex gap-2 justify-center md:justify-start text-center md:text-left"><div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-1.5 shrink-0"></div>Islamic History</li>
                                                <li className="flex gap-2 justify-center md:justify-start text-center md:text-left"><div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-1.5 shrink-0"></div>General Morals & Values</li>
                                            </ul>
                                        </div>
                                        <div className="bg-gold-50 p-4 rounded-xl">
                                            <h4 className="font-bold text-gold-800 mb-2 text-sm uppercase tracking-wider">Prizes</h4>
                                            <ul className="space-y-3">
                                                <li className="flex justify-between items-center text-sm font-bold border-b border-gold-200 pb-2">
                                                    <span>1st Place</span> <span className="text-gold-700 text-lg">₦25,000</span>
                                                </li>
                                                <li className="flex justify-between items-center text-sm font-bold border-b border-gold-200 pb-2">
                                                    <span>2nd Place</span> <span className="text-gold-700 text-lg">₦20,000</span>
                                                </li>
                                                <li className="flex justify-between items-center text-sm font-bold">
                                                    <span>3rd Place</span> <span className="text-gold-700 text-lg">₦15,000</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="text-center text-sm text-gray-500 italic mt-4">
                                        * Additional gift items will be presented to all winners.
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Rules & Dress Code */}
                        <section>
                            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 mb-6 text-center md:text-left">
                                <div className="p-2 bg-primary-100 rounded-lg text-primary-700">
                                    <Shield size={24} />
                                </div>
                                <h2 className="text-3xl font-heading font-bold text-primary-900">Program Rules & Regulations</h2>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                                {/* Dress Code */}
                                <div>
                                    <h4 className="font-bold text-primary-900 mb-3 flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 text-center md:text-left">
                                        <Star size={16} className="text-gold-500" /> Strict Islamic Dress Code
                                    </h4>
                                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-sm text-red-800">
                                        <p className="font-bold mb-2">Non-compliant participants will be denied entry.</p>
                                        <ul className="space-y-1 list-disc pl-4">
                                            <li><strong>General:</strong> All participants must dress Islamically. No inappropriate, tight, or revealing clothing allowed.</li>
                                            <li><strong>Boys:</strong> Modest thobe or loose trousers/shirt. No shorts.</li>
                                            <li><strong>Girls:</strong> Full Hijab/Jilbab covering properly. No makeup.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* General Rules */}
                                <div>
                                    <h4 className="font-bold text-primary-900 mb-3 flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 text-center md:text-left">
                                        <AlertTriangle size={16} className="text-gold-500" /> General Rules
                                    </h4>
                                    <ul className="text-sm text-gray-700 space-y-2">
                                        <li className="flex gap-2 justify-center md:justify-start text-center md:text-left"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 shrink-0"></div>Each child can only register for <strong>ONE</strong> activity.</li>
                                        <li className="flex gap-2 justify-center md:justify-start text-center md:text-left"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 shrink-0"></div>Registration is first-come, first-served.</li>
                                        <li className="flex gap-2 justify-center md:justify-start text-center md:text-left"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 shrink-0"></div>Information provided must be accurate; cheating or impersonation leads to immediate disqualification.</li>
                                        <li className="flex gap-2 justify-center md:justify-start text-center md:text-left"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 shrink-0"></div>Organizers' decisions are final.</li>
                                        <li className="flex gap-2 justify-center md:justify-start text-center md:text-left"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 shrink-0"></div>Parent/Guardian consent is mandatory.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Registration Form Column (Right - 5 cols) */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-8">
                            <div id="registration-section" className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
                                <div className="bg-primary-900 p-8 text-white text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                    <h3 className="text-2xl font-bold font-heading relative z-10">Application Form</h3>
                                    <p className="text-primary-200 text-sm mt-2 relative z-10">Secure your child's spot before slots fill up.</p>
                                </div>
                                <div className="p-2">
                                    <RegistrationForm />
                                </div>
                            </div>

                            <div className="mt-8 text-center text-sm text-gray-500">
                                <p>Having trouble validating? <br />Contact support at <a href="mailto:support@alihsan.org" className="text-primary-600 font-bold hover:underline">support@alihsan.org</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RamadanTeensPage;
