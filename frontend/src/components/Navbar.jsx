import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Car, LogOut, User, Menu, X, Sparkles } from 'lucide-react';
import { isGuestUser, enterGuestMode } from '../data/demoData';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme } = useTheme();
    const isGuest = isGuestUser();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success(isGuest ? 'Exited demo mode' : 'Logged out');
        setMobileMenuOpen(false);
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full transition-colors duration-200 backdrop-blur-xl border-b bg-white/90 dark:bg-zinc-950/90 border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform duration-200">
                            <Car size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-base sm:text-lg tracking-tight text-zinc-900 dark:text-white leading-tight">
                                Campus<span className="text-blue-600 dark:text-blue-500">Buddy</span>
                            </span>
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider -mt-0.5">
                                Peer Carpooling
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-3">
                        {token ? (
                            <>
                                {isGuest && (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-lg text-xs font-bold">
                                        <Sparkles size={13} /> Demo Mode
                                    </div>
                                )}

                                <Link 
                                    to="/dashboard" 
                                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                                        isActive('/dashboard') 
                                            ? 'bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-white' 
                                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/60 dark:hover:bg-zinc-900'
                                    }`}
                                >
                                    Find Rides
                                </Link>

                                <Link 
                                    to="/profile" 
                                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                                        isActive('/profile') 
                                            ? 'bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-white' 
                                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/60 dark:hover:bg-zinc-900'
                                    }`}
                                >
                                    <User size={15} />
                                    <span>{user?.name?.split(' ')[0] || 'My Trips'}</span>
                                </Link>

                                <ThemeToggle />

                                <button 
                                    onClick={handleLogout} 
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition ml-1"
                                >
                                    <LogOut size={14} /> {isGuest ? 'Exit Demo' : 'Sign Out'}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        enterGuestMode();
                                        toast.success('Entering Guest Demo Mode ✨');
                                        navigate('/dashboard');
                                    }}
                                    className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white font-semibold text-xs transition px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
                                >
                                    <Sparkles size={13} className="text-amber-500" /> Guest Demo
                                </button>

                                <ThemeToggle />

                                <Link 
                                    to="/login" 
                                    className={`px-3.5 py-2 text-sm font-semibold transition rounded-lg ${
                                        isActive('/login') 
                                            ? 'text-zinc-950 dark:text-white font-bold' 
                                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                                    }`}
                                >
                                    Sign In
                                </Link>

                                <Link 
                                    to="/signup" 
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition shadow-xs active:scale-95"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex md:hidden items-center gap-2">
                        <ThemeToggle />
                        <button 
                            className="p-2 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle navigation"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-4 pt-2 space-y-1.5 border-t border-zinc-200 dark:border-zinc-800">
                        {token ? (
                            <>
                                {isGuest && (
                                    <div className="px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                                        <Sparkles size={13} /> Guest Demo Mode Active
                                    </div>
                                )}
                                <Link 
                                    to="/dashboard" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-2.5 px-3 rounded-lg font-semibold text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                                >
                                    Find Rides
                                </Link>
                                <Link 
                                    to="/profile" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 py-2.5 px-3 rounded-lg font-semibold text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                                >
                                    <User size={16} /> My Trips & Profile
                                </Link>
                                <button 
                                    onClick={handleLogout} 
                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 rounded-lg border border-rose-200 dark:border-rose-500/20 mt-2"
                                >
                                    <LogOut size={16} /> {isGuest ? 'Exit Demo' : 'Sign Out'}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        enterGuestMode();
                                        setMobileMenuOpen(false);
                                        toast.success('Entering Guest Demo Mode ✨');
                                        navigate('/dashboard');
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-bold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-900 rounded-lg mb-2"
                                >
                                    <Sparkles size={15} className="text-amber-500" /> Explore as Guest (Demo)
                                </button>
                                <Link 
                                    to="/login" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-2.5 px-3 rounded-lg text-center font-semibold text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/signup" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-2.5 px-3 rounded-lg text-center font-bold text-sm bg-blue-600 text-white shadow-xs mt-1"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;