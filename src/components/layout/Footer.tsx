import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-emerald-900 text-white pt-16 pb-8 mt-auto">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                <div className="space-y-4">
                    <h3 className="text-xl font-heading font-bold text-white">Al-Ihsan Relief</h3>
                    <p className="text-emerald-100 text-sm leading-relaxed max-w-xs">
                        Serving humanity solely for the sake of Allah. Lifting lives with compassion, dignity, and hope.
                    </p>
                </div>

                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-emerald-50">Quick Links</h4>
                    <ul className="space-y-2">
                        {[
                            { to: "/", label: "Home" },
                            { to: "/about", label: "About Us" },
                            { to: "/focus", label: "Our Focus" },
                            { to: "/gallery", label: "Gallery" },
                            { to: "/donate", label: "Donate" }
                        ].map(link => (
                            <li key={link.to}>
                                <Link to={link.to} className="text-emerald-200 hover:text-white transition-colors text-sm">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-emerald-50">Contact Us</h4>
                    <ul className="space-y-3 text-sm text-emerald-100">
                        <li className="flex items-start gap-3">
                            <MapPin size={18} className="text-emerald-400 mt-0.5" />
                            <span>Ibadan, Nigeria</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Phone size={18} className="text-emerald-400 mt-0.5" />
                            <div className="flex flex-col">
                                <a href="tel:08039168308" className="hover:text-white">08039168308</a>
                                <a href="tel:08108997871" className="hover:text-white">08108997871</a>
                            </div>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail size={18} className="text-emerald-400" />
                            <a href="mailto:mhminitiative20@gmail.com" className="hover:text-white">mhminitiative20@gmail.com</a>
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-emerald-50">Connect</h4>
                    <div className="flex gap-4">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="bg-emerald-800 p-2 rounded-full hover:bg-emerald-700 transition-colors text-emerald-100 hover:text-white">
                            <Facebook size={20} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="bg-emerald-800 p-2 rounded-full hover:bg-emerald-700 transition-colors text-emerald-100 hover:text-white">
                            <Instagram size={20} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-emerald-800/50 pt-8 mt-8 text-center">
                <p className="text-emerald-300/60 text-sm">
                    &copy; {new Date().getFullYear()} Al-Ihsan Relief and Empowerment. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
