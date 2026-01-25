import React from 'react';
import { Heart, Users, BookOpen, Utensils, Stethoscope, HandHeart, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center bg-gradient-to-r from-blue-50 to-emerald-50 py-20 lg:py-0 overflow-hidden">
                {/* Abstract Background Shapes (Optional for "Premium" feel) */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-100/30 skew-x-12 translate-x-32 -z-10"></div>

                <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="space-y-8 max-w-2xl">
                        <span className="inline-block bg-emerald-100 text-emerald-800 text-sm font-semibold px-4 py-1.5 rounded-full ring-1 ring-emerald-200">
                            Welcome to Al-Ihsan Relief & Empowerment
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 leading-[1.1]">
                            Serving Humanity Solely for the Sake of <span className="text-emerald-600">Allah</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                            We are dedicated to supporting orphans, widows, vulnerable families, and underserved communities through compassionate, transparent, and sustainable initiatives rooted in Islamic values.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                to="/donate"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-white text-lg font-semibold rounded-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1"
                            >
                                Donate Now <Heart size={20} fill="currentColor" />
                            </Link>
                            <Link
                                to="/about"
                                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-emerald-500 text-emerald-600 text-lg font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative h-[400px] lg:h-[550px] w-full rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="/hero-placeholder.jpg"
                                alt="Volunteers distributing food"
                                className="w-full h-full object-cover transform transition duration-700 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8 text-white">
                                <p className="font-medium text-emerald-200 uppercase tracking-wider text-sm mb-2">Impact Story</p>
                                <h3 className="text-2xl font-bold">Bringing Smiles to Orphans</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                            <Heart size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            To alleviate suffering, restore dignity, and empower lives by providing food assistance, healthcare support, educational aid, and long-term empowerment programs, while upholding sincerity, accountability, and excellence in service.
                        </p>
                    </div>
                    <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                            <Users size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            A society where no one is left hungry, neglected, or hopeless, and where communities are strengthened through faith-driven charity and collective responsibility.
                        </p>
                    </div>
                </div>
            </section>

            {/* Who We Serve */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Who We Serve</h2>
                        <p className="text-xl text-gray-500">Our efforts are focused on those most in need within our communities.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {['Orphans in need of care', 'Widows facing hardship', 'Vulnerable families', 'Urgent medical cases', 'Crisis affected areas'].map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all text-center flex flex-col items-center gap-4 h-full">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                                    <Check size={24} />
                                </div>
                                <span className="font-medium text-gray-800">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Programs */}
            <section className="py-24 bg-emerald-900 text-white relative isolate overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.800),theme(colors.emerald.900))] opacity-50"></div>
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Our Core Programs</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ProgramCard icon={<Utensils />} title="Food Relief" description="Ramadan feeding, food distribution, and relief packages for vulnerable households." />
                        <ProgramCard icon={<HandHeart />} title="Orphan & Widow Support" description="Comprehensive support initiatives for orphans and widows." />
                        <ProgramCard icon={<Stethoscope />} title="Medical Aid" description="Medical aid and health interventions for those requiring urgent assistance." />
                        <ProgramCard icon={<BookOpen />} title="Education" description="Educational support and learning assistance for children." />
                        <ProgramCard icon={<Users />} title="Empowerment" description="Community empowerment and livelihood programs." />
                        <ProgramCard icon={<AlertCircle />} title="Emergency Response" description="Emergency and humanitarian response efforts." />
                    </div>
                </div>
            </section>

            {/* Message */}
            <section className="py-24 bg-white text-center">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Our Message is Simple</h2>

                    <div className="bg-gray-50 rounded-3xl p-8 md:p-12 mb-12">
                        <ul className="space-y-6 text-left inline-block max-w-2xl mx-auto">
                            {[
                                "We serve humanity for the sake of Allah.",
                                "No amount is too small.",
                                "Every act of kindness matters.",
                                "Charity brings us closer to Allah and strengthens the Ummah."
                            ].map((msg, i) => (
                                <li key={i} className="flex items-start gap-4 text-xl md:text-2xl text-gray-700 font-medium">
                                    <span className="text-emerald-500 mt-1"><Check size={28} strokeWidth={3} /></span>
                                    {msg}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Link to="/donate" className="inline-flex items-center justify-center px-10 py-5 bg-emerald-600 text-white text-xl font-bold rounded-full hover:bg-emerald-700 transition-colors shadow-xl hover:shadow-2xl hover:-translate-y-1">
                        Support Our Cause
                    </Link>
                </div>
            </section>
        </div>
    );
};

const ProgramCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/20 transition-colors">
        <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-900/20">
            {React.cloneElement(icon as React.ReactElement, { size: 24 })}
        </div>
        <h4 className="text-xl font-bold mb-3">{title}</h4>
        <p className="text-emerald-100 leading-relaxed font-light">{description}</p>
    </div>
);

export default Home;
