import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CarFront, LogOut, User, Menu, X, Sparkles, PlusCircle } from 'lucide-react';
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
    const isDark = theme === 'dark';
    const isGuest = isGuestUser();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success(isGuest ? 'Exited demo mode' : 'Logged out successfully');
        setMobileMenuOpen(false);
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full transition-colors duration-300 backdrop-blur-md border-b bg-white/80 dark:bg-[#090714]/80 border-slate-200 dark:border-purple-900/30 shadow-sm dark:shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="bg-gradient-to-tr from-brand to-indigo-500 text-white p-2 rounded-xl shadow-md shadow-brand/20 group-hover:scale-105 transition-transform duration-200">
                            <CarFront size={22} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                                Campus Travel Buddy
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-purple-300/60 font-semibold tracking-wider uppercase mt-0.5">
                                Campus Carpooling
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        {token ? (
                            <>
                                {isGuest && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 dark:bg-brand/20 text-amber-600 dark:text-purple-200 border border-amber-500/20 dark:border-brand/40 rounded-full text-xs font-semibold">
                                        <Sparkles size={13} className="text-amber-500 dark:text-brand" /> Demo Guest
                                    </div>
                                )}

                                <Link 
                                    to="/dashboard" 
                                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                                        isActive('/dashboard') 
                                            ? 'bg-brand/10 text-brand dark:bg-brand/20 dark:text-white' 
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-purple-950/30'
                                    }`}
                                >
                                    Dashboard
                                </Link>

                                <Link 
                                    to="/profile" 
                                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                                        isActive('/profile') 
                                            ? 'bg-brand/10 text-brand dark:bg-brand/20 dark:text-white' 
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-purple-950/30'
                                    }`}
                                >
                                    <User size={16} />
                                    <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
                                </Link>

                                {/* Theme toggle */}
                                <ThemeToggle />

                                {/* Logout */}
                                <button 
                                    onClick={handleLogout} 
                                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition border border-rose-200 dark:border-rose-500/20"
                                >
                                    <LogOut size={14} /> {isGuest ? 'Exit Demo' : 'Logout'}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        enterGuestMode();
                                        toast.success('Welcome to Guest Mode! Exploring with simulated data ✨');
                                        navigate('/dashboard');
                                    }}
                                    className="flex items-center gap-1.5 text-slate-700 dark:text-purple-300 hover:text-brand dark:hover:text-white font-semibold text-xs transition px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-purple-950/40 border border-slate-200 dark:border-purple-800/40 hover:border-brand/40"
                                >
                                    <Sparkles size={14} className="text-brand" /> Guest Demo
                                </button>

                                <ThemeToggle />

                                <Link 
                                    to="/login" 
                                    className={`px-4 py-2 text-sm font-semibold transition rounded-xl ${
                                        isActive('/login') 
                                            ? 'text-brand dark:text-white' 
                                            : 'text-slate-700 dark:text-slate-300 hover:text-brand dark:hover:text-white'
                                    }`}
                                >
                                    Login
                                </Link>

                                <Link 
                                    to="/signup" 
                                    className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-brand/25 active:scale-95"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex md:hidden items-center gap-2">
                        <ThemeToggle />
                        <button 
                            className="p-2 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-5 pt-2 space-y-2 border-t border-slate-200 dark:border-purple-900/30 animate-in slide-in-from-top-2">
                        {token ? (
                            <>
                                {isGuest && (
                                    <div className="px-4 py-2 text-xs font-semibold text-amber-600 dark:text-purple-200 flex items-center gap-1.5">
                                        <Sparkles size={13} className="text-brand" /> Guest Mode Active
                                    </div>
                                )}
                                <Link 
                                    to="/dashboard" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block py-3 px-4 rounded-xl font-semibold text-sm ${
                                        isActive('/dashboard') 
                                            ? 'bg-brand/10 text-brand dark:bg-brand/20 dark:text-white' 
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-purple-950/30'
                                    }`}
                                >
                                    Dashboard
                                </Link>
                                <Link 
                                    to="/profile" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm ${
                                        isActive('/profile') 
                                            ? 'bg-brand/10 text-brand dark:bg-brand/20 dark:text-white' 
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-purple-950/30'
                                    }`}
                                >
                                    <User size={16} /> Profile ({user?.name || 'User'})
                                </Link>
                                <button 
                                    onClick={handleLogout} 
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 rounded-xl border border-rose-200 dark:border-rose-500/20 mt-2"
                                >
                                    <LogOut size={16} /> {isGuest ? 'Exit Demo Mode' : 'Logout'}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        enterGuestMode();
                                        setMobileMenuOpen(false);
                                        toast.success('Welcome to Guest Mode! Exploring with simulated data ✨');
                                        navigate('/dashboard');
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-brand dark:text-purple-300 bg-slate-100 dark:bg-purple-950/40 rounded-xl border border-slate-200 dark:border-purple-800/40 mb-2"
                                >
                                    <Sparkles size={16} className="text-brand" /> Explore as Guest (Demo)
                                </button>
                                <Link 
                                    to="/login" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-3 px-4 rounded-xl text-center font-semibold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-purple-950/30"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/signup" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-3 px-4 rounded-xl text-center font-bold text-sm bg-brand text-white shadow-md shadow-brand/20 mt-2"
                                >
                                    Sign Up
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