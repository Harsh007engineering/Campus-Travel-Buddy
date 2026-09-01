import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserPlus, User, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import api from '../config/api';

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
            // Auto-login: backend now returns token + user on signup
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

    const inputClass = "w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition text-white placeholder-slate-500";

    return (
        <div className="flex items-center justify-center min-h-[85vh]">
            <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-800">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand text-white rounded-2xl mb-4 shadow-lg shadow-brand/30">
                        <UserPlus size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Join the Club</h2>
                    <p className="text-slate-400 mt-2">The carpooling network for VIT students</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-4 top-3.5 text-slate-500" size={20} />
                        <input type="text" placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={inputClass} />
                    </div>
                    
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-slate-500" size={20} />
                        <input type="email" placeholder="yourname@vitapstudent.ac.in" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={inputClass} />
                    </div>

                    <div className="relative">
                        <Phone className="absolute left-4 top-3.5 text-slate-500" size={20} />
                        <input type="tel" placeholder="Phone Number" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={inputClass} />
                    </div>
                    
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-slate-500" size={20} />
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Create Password (min 6 chars)" 
                            required 
                            minLength={6}
                            value={formData.password} 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            className="w-full pl-12 pr-12 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition text-white placeholder-slate-500" 
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button 
                        disabled={loading} 
                        type="submit" 
                        className="w-full bg-brand text-white font-bold py-4 rounded-xl hover:bg-purple-500 transition-all shadow-lg shadow-brand/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Creating Account...
                            </>
                        ) : 'Get Started'}
                    </button>
                </form>

                <p className="text-center mt-6 text-slate-400">
                    Already registered? <Link to="/login" className="text-brand font-bold hover:text-purple-400 transition">Sign in instead</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;