import React from 'react';
import { Utensils, HandHeart, Stethoscope, BookOpen, Users, AlertCircle } from 'lucide-react';

const Focus: React.FC = () => {
    const programs = [
        { icon: <Utensils />, title: "Food Relief", description: "Ramadan feeding, food distribution, and relief packages for vulnerable households." },
        { icon: <HandHeart />, title: "Orphan & Widow Support", description: "Comprehensive support initiatives for orphans and widows." },
        { icon: <Stethoscope />, title: "Medical Aid", description: "Medical aid and health interventions for those requiring urgent assistance." },
        { icon: <BookOpen />, title: "Education", description: "Educational support and learning assistance for children." },
        { icon: <Users />, title: "Empowerment", description: "Community empowerment and livelihood programs." },
        { icon: <AlertCircle />, title: "Emergency Response", description: "Emergency and humanitarian response efforts." },
    ];

    return (
        <div className="w-full">
            <section className="bg-emerald-900 py-20 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Our Focus</h1>
                    <p className="max-w-xl mx-auto text-emerald-100 text-lg">
                        We focus on sustainable and impactful programs that address the core needs of our community.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {programs.map((prog, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                                    {React.cloneElement(prog.icon as React.ReactElement, { size: 24 })}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">{prog.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{prog.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Focus;
