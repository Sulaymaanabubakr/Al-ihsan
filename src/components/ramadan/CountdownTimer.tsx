import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}

interface CountdownTimerProps {
    targetDate: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
    const targetTime = new Date(targetDate).getTime();
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetTime - now;

            if (difference <= 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
                milliseconds: Math.floor((difference % 1000) / 10), // Divide by 10 to show 2 digits
            });
        }, 10); // Update every 10ms for smooth millisecond display

        return () => clearInterval(interval);
    }, [targetTime]);

    return (
        <div className="w-full bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 text-white p-6 rounded-2xl shadow-xl border border-gold-500/20 relative overflow-hidden group">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-800/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-2 mb-4 text-gold-400 uppercase tracking-widest text-sm font-semibold">
                    <Clock className="w-4 h-4" />
                    <span>Program Starts In</span>
                </div>

                <div className="grid grid-cols-5 gap-2 md:gap-8 max-w-3xl mx-auto">
                    <TimeUnit value={timeLeft.days} label="Days" />
                    <TimeUnit value={timeLeft.hours} label="Hours" />
                    <TimeUnit value={timeLeft.minutes} label="Mins" />
                    <TimeUnit value={timeLeft.seconds} label="Secs" />
                    <TimeUnit value={timeLeft.milliseconds} label="Millis" isMillis />
                </div>

                <div className="mt-6 text-primary-200/80 text-sm font-light">
                    Mark your calendars for March 5, 2026
                </div>
            </div>
        </div>
    );
};

const TimeUnit: React.FC<{ value: number; label: string; isMillis?: boolean }> = ({ value, label, isMillis }) => (
    <div className="flex flex-col items-center">
        <div className={`relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl bg-white/5 backdrop-blur-sm border border-gold-500/20 text-lg sm:text-2xl md:text-3xl font-bold font-mono shadow-inner ${isMillis ? 'text-gold-300' : 'text-white'}`}>
            <span>{value.toString().padStart(2, '0')}</span>
        </div>
        <span className="mt-2 text-[10px] sm:text-xs md:text-sm uppercase tracking-wider text-gold-500/60 font-medium">{label}</span>
    </div>
);

export default CountdownTimer;
