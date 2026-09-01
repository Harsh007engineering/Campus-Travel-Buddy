import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserPlus, User, Mail, Lock, Phone, Eye, EyeOff, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
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
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success('Account created! Welcome to the club! 🎉');
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

    const inputClass = "w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-sm text-zinc-900 dark:text-white placeholder-zinc-400 shadow-xs";

    return (
        <div className="relative flex items-center justify-center min-h-[80vh] py-6">
            {/* Ambient Background Glow */}
            <div className="absolute w-80 h-80 bg-blue-500/15 dark:bg-blue-600/15 rounded-full blur-[100px] pointer-events-none -z-10 animate-blob-1"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md glass-panel p-8 sm:p-9 rounded-3xl shadow-2xl transition-colors duration-200"
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold mx-auto mb-3 shadow-lg shadow-blue-600/30">
                        <UserPlus size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-950 dark:text-white">
                        Create student account
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1 flex items-center justify-center gap-1">
                        <ShieldCheck size={13} className="text-emerald-600" /> Exclusive to college students
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-3 text-zinc-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Your Name" 
                                required 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                className={inputClass} 
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
                            University Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-3 text-zinc-400" size={16} />
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
                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
                            WhatsApp / Phone Number
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3.5 top-3 text-zinc-400" size={16} />
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
                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
                            Password (min 6 characters)
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-3 text-zinc-400" size={16} />
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder="Create password" 
                                required 
                                minLength={6}
                                value={formData.password} 
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                className="w-full pl-10 pr-10 py-2.5 bg-white/70 dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-sm text-zinc-900 dark:text-white placeholder-zinc-400 shadow-xs" 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)} 
                                className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        disabled={loading} 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition shadow-md shadow-blue-600/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 text-sm"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-zinc-200/60 dark:border-zinc-800/80"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                        <span className="glass-panel px-3 text-zinc-400 rounded-full">
                            Not from VIT-AP?
                        </span>
                    </div>
                </div>

                {/* Guest Mode CTA */}
                <button 
                    type="button"
                    onClick={() => {
                        enterGuestMode();
                        toast.success('Welcome to Guest Demo Mode ✨');
                        navigate('/dashboard');
                    }}
                    className="w-full glass-panel hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                    <Sparkles size={14} className="text-amber-500" /> Continue as Guest (Demo Mode)
                </button>

                <p className="text-center mt-5 text-xs text-zinc-500">
                    Already registered? <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Sign in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;