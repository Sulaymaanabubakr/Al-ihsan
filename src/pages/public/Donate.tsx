import React from 'react';
import { Heart, CreditCard, ShieldCheck } from 'lucide-react';

const Donate: React.FC = () => {
    return (
        <div className="w-full">
            <section className="bg-emerald-900 py-20 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Donate Now</h1>
                    <p className="max-w-xl mx-auto text-emerald-100 text-lg">
                        Your generous donation helps us provide food, healthcare, and education to those in need.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">

                        {/* Donation Form */}
                        <div className="p-8 md:p-12 w-full md:w-2/3">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Heart className="text-emerald-500 fill-current" /> Make a Donation
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Amount (NGN)</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['1000', '5000', '10000', '20000', '50000'].map((amt) => (
                                            <button key={amt} className="py-2 px-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors font-semibold text-gray-700">
                                                ₦{amt}
                                            </button>
                                        ))}
                                        <input type="number" placeholder="Custom" className="py-2 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none w-full" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Donation Type</label>
                                    <select className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none">
                                        <option>General Donation (Sadaqah)</option>
                                        <option>Zakat</option>
                                        <option>Orphan Support</option>
                                        <option>Ramadan Feeding</option>
                                    </select>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input type="email" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-emerald-600 text-white font-bold text-lg rounded-xl hover:bg-emerald-700 transition-colors shadow-lg flex justify-center items-center gap-2">
                                    <CreditCard size={20} /> Proceed to Pay
                                </button>

                                <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
                                    <ShieldCheck size={14} /> Secure payment via Paystack
                                </p>
                            </div>
                        </div>

                        {/* Bank Transfer Details SIDEBAR */}
                        <div className="bg-gray-50 p-8 w-full md:w-1/3 border-l border-gray-100 flex flex-col justify-center">
                            <h3 className="font-bold text-gray-900 mb-4">Direct Bank Transfer</h3>
                            <div className="space-y-4 text-sm text-gray-600">
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <p className="font-semibold text-emerald-800">Jaiz Bank</p>
                                    <p className="text-xl font-mono text-gray-900 my-1">0003668731</p>
                                    <p className="text-xs text-gray-500">Muslims Helping Humanity Foundation</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <p className="font-semibold text-emerald-800">JAIZ BANK (ZAKAT)</p>
                                    <p className="text-xl font-mono text-gray-900 my-1">0011684333</p>
                                    <p className="text-xs text-gray-500">Muslims Helping Humanity Foundation</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default Donate;
