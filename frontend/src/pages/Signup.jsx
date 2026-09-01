import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserPlus, User, Mail, Lock, Phone, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../config/api';
import { enterGuestMode } from '../data/demoData';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/signup', formData);
            // Auto-login: backend returns token + user on signup
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success('Account created! Welcome aboard! 🎉');
            navigate('/dashboard');
        } catch (error) {
            const msg = error.response?.data?.error 
                ? `${error.response.data.message} (${error.response.data.error})`
                : (error.response?.data?.message || 'Signup failed. Please try again.');
            toast.error(msg, { duration: 6000 });
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#0f0b22] border border-slate-200 dark:border-purple-900/40 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500";

    return (
        <div className="flex items-center justify-center min-h-[80vh] py-6">
            <div className="w-full max-w-md bg-white dark:bg-[#15102a]/90 backdrop-blur-xl p-8 sm:p-9 rounded-3xl shadow-xl dark:shadow-2xl border border-slate-200 dark:border-purple-900/50 transition-colors duration-300">
                
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-brand to-indigo-500 text-white rounded-2xl mb-4 shadow-lg shadow-brand/25">
                        <UserPlus size={26} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Join the Club
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-purple-200/70 mt-1.5 flex items-center justify-center gap-1">
                        <ShieldCheck size={14} className="text-emerald-500" /> Exclusive to verified college students
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div>
                        <label className="text-xs font-bold text-slate-600 dark:text-purple-300/70 uppercase tracking-wider mb-1 block">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={18} />
                            <input 
                                type="text" 
                                placeholder="Harsh Vardhan" 
                                required 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                className={inputClass} 
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-slate-600 dark:text-purple-300/70 uppercase tracking-wider mb-1 block">
                            University Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={18} />
                            <input 
                                type="email" 
                                placeholder="yourname.24bce@vitapstudent.ac.in" 
                                required 
                                value={formData.email} 
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                className={inputClass} 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-600 dark:text-purple-300/70 uppercase tracking-wider mb-1 block">
                            Phone Number
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={18} />
                            <input 
                                type="tel" 
                                placeholder="+91 98765 43210" 
                                required 
                                value={formData.phone} 
                                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                                className={inputClass} 
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-slate-600 dark:text-purple-300/70 uppercase tracking-wider mb-1 block">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={18} />
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder="Min 6 characters" 
                                required 
                                minLength={6}
                                value={formData.password} 
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                className="w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-[#0f0b22] border border-slate-200 dark:border-purple-900/40 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500" 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)} 
                                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        disabled={loading} 
                        type="submit" 
                        className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-brand/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Creating Account...
                            </>
                        ) : (
                            <>Create Account <ArrowRight size={16} /></>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                        <span className="bg-white dark:bg-[#15102a] px-3 text-slate-400 dark:text-slate-500 font-bold">
                            Not a VIT-AP Student?
                        </span>
                    </div>
                </div>

                {/* Guest Mode CTA */}
                <button 
                    type="button"
                    onClick={() => {
                        enterGuestMode();
                        toast.success('Welcome to Guest Mode! Exploring with simulated data ✨');
                        navigate('/dashboard');
                    }}
                    className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-[#0f0b22] dark:hover:bg-[#1b153b] text-slate-800 dark:text-purple-200 border border-slate-200 dark:border-purple-900/60 font-bold py-3 rounded-xl transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                >
                    <Sparkles size={16} className="text-brand" /> Continue as Guest (Demo Mode)
                </button>

                <p className="text-center mt-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Already registered? <Link to="/login" className="text-brand font-bold hover:underline">Sign in instead</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;