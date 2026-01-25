import React from 'react';
import { Link } from 'react-router-dom';

interface UrgentAppealProps {
    title: string;
    description: string;
    raised: number;
    goal: number;
    imagePlaceholder?: boolean;
}

const UrgentAppealCard: React.FC<UrgentAppealProps> = ({ title, description, raised, goal, imagePlaceholder = true }) => {
    const percentage = Math.min((raised / goal) * 100, 100);

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
            {imagePlaceholder ? (
                <div className="h-48 bg-gray-200 relative flex items-center justify-center overflow-hidden">
                    <span className="text-gray-400 font-medium">Appeal Visual</span>
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        URGENT
                    </div>
                </div>
            ) : null}

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-heading font-bold text-primary-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm mb-6 flex-grow">{description}</p>

                <div className="mb-4">
                    <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-gold-600">₦{raised.toLocaleString()} Raised</span>
                        <span className="text-gray-400">of ₦{goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-gold-500 h-2.5 rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                </div>

                <Link
                    to="/donate"
                    className="w-full py-3 bg-primary-900 text-white rounded-lg font-bold text-center hover:bg-primary-800 transition-colors"
                >
                    Donate Now
                </Link>
            </div>
        </div>
    );
};

export default UrgentAppealCard;
