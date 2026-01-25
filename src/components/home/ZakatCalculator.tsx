import React, { useState } from 'react';
import { ArrowRight, Calculator } from 'lucide-react';

const ZakatCalculator: React.FC = () => {
    const [cash, setCash] = useState<string>('');
    const [gold, setGold] = useState<string>('');
    const [silver, setSilver] = useState<string>('');

    const calculateZakat = () => {
        const c = parseFloat(cash) || 0;
        const g = parseFloat(gold) || 0;
        const s = parseFloat(silver) || 0;
        return ((c + g + s) * 0.025).toLocaleString();
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gold-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gold-100 rounded-lg text-gold-600">
                    <Calculator size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-heading font-bold text-primary-900">Mini Zakat Calculator</h3>
                    <p className="text-xs text-gray-500">Calculate 2.5% of your wealth</p>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cash Savings (₦)</label>
                    <input
                        type="number"
                        value={cash}
                        onChange={(e) => setCash(e.target.value)}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                        placeholder="0.00"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gold (Value)</label>
                        <input
                            type="number"
                            value={gold}
                            onChange={(e) => setGold(e.target.value)}
                            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Silver (Value)</label>
                        <input
                            type="number"
                            value={silver}
                            onChange={(e) => setSilver(e.target.value)}
                            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                            placeholder="0.00"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-primary-900 text-white p-4 rounded-xl flex justify-between items-center mb-6">
                <span className="text-primary-200 font-medium">Estimated Zakat:</span>
                <span className="text-2xl font-bold text-gold-400">₦{calculateZakat()}</span>
            </div>

            <button className="w-full py-3 border-2 border-primary-900 text-primary-900 font-bold rounded-full hover:bg-primary-900 hover:text-white transition-all flex items-center justify-center gap-2">
                Full Zakat Calculation <ArrowRight size={18} />
            </button>
        </div>
    );
};

export default ZakatCalculator;
