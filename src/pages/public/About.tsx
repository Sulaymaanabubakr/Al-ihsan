import React from 'react';
import { Target, Heart, Shield, Users, Award } from 'lucide-react';

const About: React.FC = () => {
    return (
        <div className="w-full">
            {/* Header */}
            <section className="bg-emerald-900 py-20 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">About Us</h1>
                    <p className="max-w-2xl mx-auto text-emerald-100 text-lg">
                        Al-Ihsan Relief and Empowerment is a registered, faith-based NGO established to serve humanity solely for the sake of Allah.
                    </p>
                </div>
            </section>

            {/* Story & Values */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-12">

                        <div className="space-y-6">
                            <h2 className="text-3xl font-heading font-bold text-gray-900">Our Essence</h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                We are dedicated to supporting orphans, widows, vulnerable families, and underserved communities through compassionate, transparent, and sustainable initiatives rooted in Islamic values. Every donation is treated as an <em>amanah</em> (trust), and every beneficiary is served with dignity.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
                                <Target className="w-10 h-10 text-emerald-600 mb-4" />
                                <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                                <p className="text-gray-700">
                                    To alleviate suffering, restore dignity, and empower lives by providing food assistance, healthcare, and education, while upholding sincerity and accountability.
                                </p>
                            </div>
                            <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
                                <Heart className="w-10 h-10 text-blue-600 mb-4" />
                                <h3 className="text-xl font-bold mb-2">Our Vision</h3>
                                <p className="text-gray-700">
                                    A society where no one is left hungry or Hopeless, and communities are strengthened through faith-driven charity and collective responsibility.
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8 text-center">Our Core Values</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <ValueCard icon={<Shield />} title="Sincerity" desc="(Ikhlas)" />
                                <ValueCard icon={<Users />} title="Compassion" desc="(Rahmah)" />
                                <ValueCard icon={<Award />} title="Excellence" desc="(Ihsan)" />
                                <ValueCard icon={<Target />} title="Transparency" desc="(Amanah)" />
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

const ValueCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="flex flex-col items-center text-center p-6 bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl border border-gray-100">
        <div className="w-12 h-12 bg-gray-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
            {React.cloneElement(icon as React.ReactElement, { size: 20 })}
        </div>
        <h4 className="font-bold text-gray-900">{title}</h4>
        <span className="text-sm text-gray-500 italic">{desc}</span>
    </div>
);

export default About;
