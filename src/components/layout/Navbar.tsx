import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Programs', path: '/focus' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled
            ? 'bg-primary-900/95 backdrop-blur-md shadow-2xl py-2 border-white/10'
            : 'bg-transparent py-6 border-transparent'
            }`}>
            <div className="container mx-auto px-6 flex justify-between items-center w-full">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gold-400 rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                        <img
                            src="/logo.jpeg"
                            alt="Al-Ihsan Logo"
                            className="h-12 w-12 relative z-10 rounded-full object-cover border-2 border-gold-500 shadow-lg"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-heading font-bold text-white tracking-wide">
                            Al-Ihsan<span className="text-gold-400">.</span>
                        </span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <ul className="flex gap-1 items-center bg-white/5 px-2 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden group ${isActive(link.path)
                                        ? 'text-primary-900 bg-gold-400 font-bold shadow-lg'
                                        : 'text-gray-200 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                        <Link
                            to="/donate"
                            className="px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.5)] transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-sm tracking-wide"
                        >
                            Donate <Heart size={14} fill="currentColor" />
                        </Link>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white hover:text-gold-400 transition-colors bg-white/10 p-2 rounded-lg backdrop-blur-sm"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="absolute top-full left-0 w-full bg-primary-900/95 backdrop-blur-xl border-t border-white/10 p-6 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-5 shadow-2xl h-screen">
                        <ul className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className={`block py-4 px-6 rounded-xl transition-all ${isActive(link.path)
                                            ? 'bg-gold-500/20 text-gold-400 font-bold border border-gold-500/30'
                                            : 'text-gray-200 hover:bg-white/5'
                                            }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                            <div className="mt-8">
                                <Link
                                    to="/donate"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-gold-500 text-white font-bold rounded-xl shadow-lg"
                                >
                                    Donate Now <Heart size={18} fill="currentColor" />
                                </Link>
                            </div>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
