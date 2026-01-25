import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Programs', path: '/focus' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 h-[80px] flex items-center">
            <div className="container mx-auto px-4 flex justify-between items-center w-full">
                <Link to="/" className="flex items-center gap-3 font-bold text-emerald-900 group">
                    <div className="relative">
                        <img
                            src="/logo.png"
                            alt="Al-Ihsan Logo"
                            className="h-12 w-12 rounded-full object-cover border-2 border-emerald-500 transition-transform group-hover:scale-105"
                        />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-xl text-emerald-600 font-heading">Al-Ihsan</span>
                        <span className="text-xs text-gray-500 font-medium tracking-wide">Relief & Empowerment</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <ul className="flex gap-8 items-center">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    className={`text-sm font-medium transition-colors hover:text-emerald-500 ${isActive(link.path) ? 'text-emerald-600 font-semibold' : 'text-gray-600'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Link
                        to="/donate"
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors shadow-sm hover:shadow-md"
                    >
                        Donate Now <Heart size={16} fill="currentColor" />
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-gray-700 hover:text-emerald-600 focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle navigation"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg p-4 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-2">
                        <ul className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className={`block py-3 px-4 rounded-md transition-colors ${isActive(link.path)
                                            ? 'bg-emerald-50 text-emerald-700 font-semibold'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-2">
                                <Link
                                    to="/donate"
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white font-semibold rounded-lg active:bg-emerald-600"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Donate Now
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
