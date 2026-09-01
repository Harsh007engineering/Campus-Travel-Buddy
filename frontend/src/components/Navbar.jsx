import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CarFront, LogOut, User, Menu, X } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out safely');
        setMobileMenuOpen(false);
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const NavLinks = ({ mobile = false }) => (
        <>
            {token ? (
                <>
                    <Link 
                        to="/dashboard" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`${mobile ? 'block py-3 px-4 rounded-xl' : ''} ${isActive('/dashboard') ? 'text-white font-bold' : 'text-slate-400 hover:text-white'} font-medium transition`}
                    >
                        Dashboard
                    </Link>
                    <Link 
                        to="/profile" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-1 ${mobile ? 'py-3 px-4 rounded-xl' : ''} ${isActive('/profile') ? 'text-brand font-bold' : 'text-slate-400 hover:text-brand'} font-medium transition`}
                    >
                        <User size={18} /> Profile
                    </Link>
                    <button 
                        onClick={handleLogout} 
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-full transition border border-red-500/20 ${mobile ? 'w-full justify-center mt-2' : 'ml-2'}`}
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </>
            ) : (
                <>
                    <Link 
                        to="/login" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`${mobile ? 'block py-3 px-4 rounded-xl text-center' : ''} ${isActive('/login') ? 'text-white font-bold' : 'text-slate-400 hover:text-white'} font-medium transition`}
                    >
                        Login
                    </Link>
                    <Link 
                        to="/signup" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-5 py-2 bg-brand text-white text-sm font-medium rounded-full hover:bg-purple-500 transition shadow-lg shadow-brand/20 ${mobile ? 'block text-center mt-2' : ''}`}
                    >
                        Sign Up
                    </Link>
                </>
            )}
        </>
    );

    return (
        <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
                        <div className="bg-brand text-white p-2 rounded-xl shadow-lg shadow-brand/20">
                            <CarFront size={24} />
                        </div>
                        <span className="font-bold text-lg sm:text-xl tracking-tight text-white">Campus Travel Buddy</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <NavLinks />
                    </div>

                    {/* Mobile hamburger */}
                    <button 
                        className="md:hidden text-white p-2 hover:bg-slate-800 rounded-xl transition"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-4 pt-2 space-y-2 border-t border-slate-800 animate-in slide-in-from-top">
                        <NavLinks mobile={true} />
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;