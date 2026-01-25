import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, BookOpen, Utensils, Activity, ShieldCheck, TrendingUp, Building2, Users2 } from 'lucide-react';
import { motion } from 'framer-motion';

import SEO from '../../components/common/SEO';
import CountUp from '../../components/common/CountUp';
import ImpactPieChart from '../../components/home/ImpactPieChart';
import UrgentAppealCard from '../../components/home/UrgentAppealCard';
import ZakatCalculator from '../../components/home/ZakatCalculator';
import FloatingWhatsApp from '../../components/common/FloatingWhatsApp';

const Home: React.FC = () => {
    return (
        <div className="overflow-x-hidden">
            <SEO
                title="Home"
                description="Al-Ihsan Relief & Empowerment - Dedicated to lifting the burden of the needy through sustainable food, health, and education solely for the sake of Allah."
            />

            {/* 1. HERO SECTION (The Hook) */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-primary-950 -mt-[88px]">
                {/* Visual Background Placeholder */}
                <div className="absolute inset-0 bg-primary-900 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 to-primary-900/80 z-10"></div>
                    {/* Placeholder for "High-Quality Photo/Video" */}
                    <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                </div>

                <div className="container mx-auto px-4 relative z-20 pt-20">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        {/* Text Content */}
                        <div className="flex-1 text-center md:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6"
                            >
                                <span className="inline-block px-4 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm font-bold tracking-widest uppercase mb-4">
                                    Bismillah-ir-Rahman-ir-Rahim
                                </span>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-[1.1]">
                                    Empowering the <span className="text-gold-500">Ummah</span> through <br className="hidden md:block" />
                                    Sustainable Relief.
                                </h1>
                                <p className="text-xl text-primary-200 mb-8 max-w-xl mx-auto md:mx-0 font-light">
                                    Join us in our mission to lift the needy out of poverty. Your Sadaqah writes stories of hope.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                    <Link to="/donate" className="px-8 py-4 bg-gold-500 text-primary-950 font-bold rounded-lg shadow-lg hover:bg-gold-400 transition-all flex items-center justify-center gap-2">
                                        Donate Now <Heart fill="currentColor" size={18} />
                                    </Link>
                                    <Link to="/focus" className="px-8 py-4 border-2 border-white/20 text-white font-bold rounded-lg hover:bg-white/10 transition-all">
                                        Our Projects
                                    </Link>
                                </div>
                            </motion.div>
                        </div>

                        {/* Hero Visual/Card */}
                        <div className="flex-1 w-full max-w-lg hidden md:block">
                            <div className="relative aspect-square rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
                                <div className="absolute inset-0 bg-primary-800 flex items-center justify-center text-white/20 font-bold text-3xl text-center p-8">
                                    High-Quality Field visual would go here
                                </div>
                                {/* Floating Overlay Card */}
                                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center text-primary-900 font-bold">
                                            <TrendingUp size={24} />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-lg">Goal Reached</p>
                                            <p className="text-gold-300 text-sm">Alhamdulillah for your support</p>
                                        </div>
                                        <div className="ml-auto text-2xl font-bold text-white">94%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. URGENT APPEALS (The "Need") */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-red-500 font-bold tracking-widest uppercase text-sm mb-2 block animate-pulse">Emergency Response</span>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900">Urgent Appeals</h2>
                        </div>
                        <div className="hidden md:flex gap-2">
                            <button className="w-10 h-10 border border-primary-200 rounded-full flex items-center justify-center hover:bg-primary-900 hover:text-white transition-colors">
                                <ArrowRight className="rotate-180" size={20} />
                            </button>
                            <button className="w-10 h-10 border border-primary-900 bg-primary-900 text-white rounded-full flex items-center justify-center hover:bg-primary-800 transition-colors">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Horizontal Slider (Grid for now) */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <UrgentAppealCard
                            title="Winter Relief 2026"
                            description="Provide blankets and heaters for families in displacement camps facing freezing temperatures."
                            raised={450000}
                            goal={1000000}
                        />
                        <UrgentAppealCard
                            title="Ramadan Food Packs"
                            description="Ensure no family goes hungry this Ramadan. Provide a month's worth of food."
                            raised={120000}
                            goal={500000}
                        />
                        <UrgentAppealCard
                            title="Urgent Medical Fund"
                            description="Support life-saving surgeries for critical patients unable to afford care."
                            raised={850000}
                            goal={2000000}
                        />
                    </div>
                </div>
            </section>

            {/* 3. ZAKAT & SADAQAH QUICK LINKS */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Quick Links */}
                        <div>
                            <span className="text-gold-500 font-bold tracking-widest uppercase text-sm mb-2 block">Ways to Give</span>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-8">Fulfill Your Obligation</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { title: "Pay Zakat", desc: "Purify your wealth (2.5%)", icon: Building2 },
                                    { title: "Sadaqah Jariyah", desc: "Build wells, mosques, trees", icon: Users2 },
                                    { title: "Orphan Sponsorship", desc: "Monthly support for a child", icon: Users },
                                    { title: "General Charity", desc: "Where needed most", icon: Heart }
                                ].map((item, i) => (
                                    <Link key={i} to="/donate" className="p-6 border border-gray-100 rounded-xl hover:shadow-lg hover:border-gold-500/30 transition-all group">
                                        <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-900 mb-4 group-hover:bg-gold-500 group-hover:text-white transition-colors">
                                            <item.icon size={24} />
                                        </div>
                                        <h3 className="font-bold text-lg text-primary-900">{item.title}</h3>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Mini Calculator */}
                        <div>
                            <ZakatCalculator />
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. IMPACT TRANSPARENCY (The "Proof") */}
            <section className="py-20 bg-primary-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-transparent opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-4 gap-8 text-center border-b border-white/10 pb-12 mb-12">
                        {[
                            { label: "Lives Impacted", value: 15000, suffix: "+" },
                            { label: "Meals Served", value: 50000, suffix: "+" },
                            { label: "Communities", value: 45, suffix: "" },
                            { label: "Volunteers", value: 120, suffix: "+" }
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-4xl lg:text-5xl font-heading font-bold text-gold-500 mb-2">
                                    <CountUp end={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="text-primary-200 text-sm uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder Trust Badges */}
                        <div className="flex items-center gap-2"><ShieldCheck /> CAC Registered</div>
                        <div className="flex items-center gap-2"><Building2 /> Shari'ah Compliant</div>
                        <div className="flex items-center gap-2"><Users /> EFCC SCUML</div>
                    </div>
                </div>
            </section>

            {/* 6. WHERE YOUR MONEY GOES (The "Accountability") */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-gold-500 font-bold tracking-widest uppercase text-sm mb-2 block">Transparency</span>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900">Where Your Money Goes</h2>
                        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">We categorize every donation to ensure it is used exactly as defined by Shari'ah and donor intent.</p>
                    </div>

                    <ImpactPieChart />
                </div>
            </section>

            {/* 5. SUCCESS STORIES (The "Heart") & EDUCATION */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Success Story */}
                        <div>
                            <span className="text-gold-500 font-bold tracking-widest uppercase text-sm mb-4 block">Success Stories</span>
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                                <div className="flex gap-4 mb-6">
                                    <div className="w-1/2 aspect-square bg-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-500">Before</div>
                                    <div className="w-1/2 aspect-square bg-primary-100 rounded-xl flex items-center justify-center text-xs text-primary-800">After</div>
                                </div>
                                <blockquote className="text-xl text-primary-900 font-heading italic mb-6">
                                    "Thanks to your Sadaqah, Amina’s family in Borno now has access to clean water daily. Before, they walked 5km every morning."
                                </blockquote>
                                <Link to="/stories" className="text-gold-600 font-bold hover:text-primary-900 flex items-center gap-2">
                                    Read Full Story <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>

                        {/* Latest Education/News */}
                        <div>
                            <span className="text-gold-500 font-bold tracking-widest uppercase text-sm mb-4 block">Education & News</span>
                            <div className="space-y-6">
                                {[
                                    { title: "The Virtues of Giving Charity in Secret", date: "Oct 24, 2025" },
                                    { title: "5 Ways to Help Orphans Without Money", date: "Sep 12, 2025" },
                                    { title: "Our 2025 Impact Report Released", date: "Aug 01, 2025" }
                                ].map((news, i) => (
                                    <div key={i} className="flex gap-4 group cursor-pointer">
                                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                                        <div>
                                            <div className="text-xs text-gold-600 font-bold mb-1">{news.date}</div>
                                            <h4 className="text-lg font-bold text-primary-900 group-hover:text-gold-500 transition-colors">{news.title}</h4>
                                            <a href="#" className="text-sm text-gray-500 mt-2 inline-block">Read article</a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-20 bg-primary-950 border-t border-white/10">
                <div className="container mx-auto px-4 text-center max-w-2xl">
                    <h2 className="text-3xl font-heading font-bold text-white mb-4">Join Our Community</h2>
                    <p className="text-primary-200 mb-8">Receive updates on our appeals and Islamic reminders.</p>
                    <div className="flex gap-2">
                        <input type="email" placeholder="Enter your email address" className="flex-1 p-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-gold-500 outline-none" />
                        <button className="px-8 py-4 bg-gold-500 text-primary-900 font-bold rounded-lg hover:bg-gold-400">Subscribe</button>
                    </div>
                </div>
            </section>

            <FloatingWhatsApp />
        </div>
    );
};

export default Home;
