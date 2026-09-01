import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogOut, User, Menu, X, Sparkles, Plus } from 'lucide-react';
import { isGuestUser, enterGuestMode } from '../data/demoData';
import ThemeToggle from './ThemeToggle';
import CampusLogo from './CampusLogo';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isGuest = isGuestUser();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success(isGuest ? 'Exited demo mode' : 'Signed out successfully');
        setMobileMenuOpen(false);
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full pt-3 px-3 sm:px-6">
            <div className="max-w-6xl mx-auto rounded-2xl border transition-all duration-200 backdrop-blur-2xl bg-white/85 dark:bg-[#0d0d11]/85 border-zinc-200/90 dark:border-zinc-800/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] px-4 sm:px-5">
                <div className="flex justify-between items-center h-14 sm:h-16">
                    {/* Brand Emblem & Wordmark */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <CampusLogo size={32} />
                        <div className="flex flex-col">
                            <span className="font-black text-base sm:text-lg tracking-tight text-zinc-950 dark:text-white leading-none">
                                Campus<span className="text-blue-600 dark:text-blue-500">Buddy</span>
                            </span>
                            <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-extrabold uppercase tracking-widest mt-0.5">
                                VIT-AP Mobility
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-2">
                        {token ? (
                            <>
                                {isGuest && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-lg text-xs font-bold mr-1">
                                        <Sparkles size={12} /> Guest Mode
                                    </span>
                                )}

                                <Link 
                                    to="/dashboard" 
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                                        isActive('/dashboard') 
                                            ? 'bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-white' 
                                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/60 dark:hover:bg-zinc-900'
                                    }`}
                                >
                                    Find Rides
                                </Link>

                                <Link 
                                    to="/profile" 
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                                        isActive('/profile') 
                                            ? 'bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-white' 
                                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/60 dark:hover:bg-zinc-900'
                                    }`}
                                >
                                    <User size={14} />
                                    <span>{user?.name?.split(' ')[0] || 'My Trips'}</span>
                                </Link>

                                <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

                                <ThemeToggle />

                                <button 
                                    onClick={handleLogout} 
                                    className="p-2 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
                                    title={isGuest ? 'Exit Demo' : 'Sign Out'}
                                >
                                    <LogOut size={16} />
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
                                    className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white font-bold text-xs transition px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
                                >
                                    <Sparkles size={12} className="text-amber-500" /> Guest Demo
                                </button>

                                <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

                                <ThemeToggle />

                                <Link 
                                    to="/login" 
                                    className={`px-3 py-1.5 text-xs font-bold transition rounded-xl ${
                                        isActive('/login') 
                                            ? 'text-zinc-950 dark:text-white' 
                                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                                    }`}
                                >
                                    Sign In
                                </Link>

                                <Link 
                                    to="/signup" 
                                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs active:scale-95"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger Controls */}
                    <div className="flex md:hidden items-center gap-2">
                        <ThemeToggle />
                        <button 
                            className="p-2 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle navigation"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-4 pt-2 space-y-1 border-t border-zinc-100 dark:border-zinc-800/80">
                        {token ? (
                            <>
                                {isGuest && (
                                    <div className="px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                                        <Sparkles size={12} /> Demo Mode Active
                                    </div>
                                )}
                                <Link 
                                    to="/dashboard" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-2.5 px-3 rounded-xl font-bold text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                    Find Rides
                                </Link>
                                <Link 
                                    to="/profile" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                    <User size={15} /> My Trips & Profile
                                </Link>
                                <button 
                                    onClick={handleLogout} 
                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 rounded-xl border border-rose-200 dark:border-rose-500/20 mt-1"
                                >
                                    <LogOut size={14} /> {isGuest ? 'Exit Demo' : 'Sign Out'}
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
                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-1.5"
                                >
                                    <Sparkles size={14} className="text-amber-500" /> Explore as Guest (Demo)
                                </button>
                                <Link 
                                    to="/login" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-2.5 px-3 rounded-xl text-center font-bold text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/signup" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-2.5 px-3 rounded-xl text-center font-bold text-xs bg-blue-600 text-white shadow-xs mt-1"
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