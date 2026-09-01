import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import CampusLogo from './components/CampusLogo';
import InteractiveBackground from './components/InteractiveBackground';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { 
    Shield, Users, MapPin, Zap, Sparkles, 
    ArrowRight, CheckCircle2, MessageCircle, Clock, ChevronDown, 
    Code2, Lock, Compass, Check, TrendingDown, Flame, Car
} from 'lucide-react';
import { enterGuestMode } from './data/demoData';

// Landing Page Component with Crazy Glassmorphism and Motion
const LandingPage = () => {
    const navigate = useNavigate();
    const [searchTo, setSearchTo] = useState('');
    const [openFaq, setOpenFaq] = useState(null);
    const [tickerIndex, setTickerIndex] = useState(0);

    const livePills = [
        { name: 'Rahul V.', to: 'Vijayawada Stn', time: 'Just now', seats: '2 open' },
        { name: 'Sneha R.', to: 'Guntur Bus Stand', time: '2m ago', seats: '1 open' },
        { name: 'Karthik R.', to: 'Hyderabad Airport', time: '5m ago', seats: '3 open' },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setTickerIndex(prev => (prev + 1) % livePills.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleQuickSearch = (e) => {
        e.preventDefault();
        enterGuestMode();
        navigate('/dashboard');
    };

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="relative space-y-24 sm:space-y-36 overflow-hidden">
            {/* AMBIENT FLOATING COLOR BLOBS (Crazy Glass Lighting) */}
            <div className="absolute top-[-80px] left-[-100px] w-96 h-96 bg-blue-500/20 dark:bg-blue-600/15 rounded-full blur-[110px] pointer-events-none -z-10 animate-blob-1"></div>
            <div className="absolute top-[280px] right-[-100px] w-96 h-96 bg-cyan-400/15 dark:bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-blob-2"></div>
            <div className="absolute top-[900px] left-1/3 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-blob-1"></div>

            {/* HERO SECTION */}
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="pt-6 sm:pt-14 pb-8 sm:pb-16 text-center flex flex-col items-center relative"
            >
                {/* Live Floating Social Proof Pill */}
                <motion.div 
                    initial={{ scale: 0.95 }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="inline-flex items-center gap-2.5 px-4 py-1.5 glass-panel rounded-full text-xs font-bold mb-6 shadow-sm cursor-pointer"
                    onClick={() => { enterGuestMode(); navigate('/dashboard'); }}
                >
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400">Live Ride:</span>
                    <span className="text-zinc-950 dark:text-white">{livePills[tickerIndex].name} ➔ {livePills[tickerIndex].to}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-extrabold bg-blue-500/10 px-2 py-0.5 rounded-md text-[10px]">
                        {livePills[tickerIndex].seats}
                    </span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-950 dark:text-white mb-6 max-w-4xl leading-[1.06]"
                >
                    Stop overpaying for campus travel.
                    <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent mt-1.5">
                        Share verified rides instead.
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-base sm:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl font-normal leading-relaxed"
                >
                    The peer-to-peer carpooling network engineered exclusively for university students. Split fuel, ride with verified classmates, and coordinate pickups on WhatsApp.
                </motion.p>

                {/* CTA Action Buttons */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center mb-14"
                >
                    <Link 
                        to="/signup" 
                        className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/25 text-sm flex items-center justify-center gap-2 active:scale-95 group"
                    >
                        Sign Up with Student Email 
                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    <button 
                        type="button"
                        onClick={() => {
                            enterGuestMode();
                            window.location.href = '/dashboard';
                        }}
                        className="px-6 py-3.5 glass-panel hover:bg-white/90 dark:hover:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl transition text-sm flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                    >
                        <Sparkles size={15} className="text-amber-500" /> Explore Demo Mode
                    </button>
                </motion.div>

                {/* INTERACTIVE TRIP FINDER WIDGET (Frosted Glass) */}
                <motion.div 
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="w-full max-w-3xl glass-panel p-4 sm:p-5 rounded-3xl shadow-2xl text-left"
                >
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3 flex items-center gap-2">
                        <Compass size={14} className="text-blue-600" /> Quick Trip Finder
                    </div>
                    
                    <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
                            <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Leaving From</label>
                            <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
                                <MapPin size={15} className="text-blue-600 shrink-0" />
                                <span className="truncate">VIT-AP Main Gate</span>
                            </div>
                        </div>

                        <div className="p-3 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
                            <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Going To</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Vijayawada, Airport..." 
                                value={searchTo} 
                                onChange={(e) => setSearchTo(e.target.value)} 
                                className="w-full bg-transparent text-sm font-bold text-zinc-900 dark:text-white outline-none placeholder-zinc-400"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="bg-zinc-950 dark:bg-blue-600 hover:bg-zinc-800 dark:hover:bg-blue-700 text-white font-bold rounded-2xl px-5 py-3 flex items-center justify-center gap-2 transition text-sm shadow-md active:scale-95"
                        >
                            Search Rides <ArrowRight size={15} />
                        </button>
                    </form>

                    {/* Quick Destination Chips with Hover Lift */}
                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/80 text-xs font-semibold">
                        <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">FREQUENT ROUTES:</span>
                        {[
                            { name: 'Vijayawada Stn', price: '₹120' },
                            { name: 'Guntur Bus Stand', price: '₹80' },
                            { name: 'Hyderabad Airport', price: '₹650' },
                            { name: 'PVP Square Mall', price: '₹100' },
                        ].map((dest, i) => (
                            <motion.button
                                whileHover={{ scale: 1.04, y: -2 }}
                                whileTap={{ scale: 0.96 }}
                                key={i}
                                type="button"
                                onClick={() => {
                                    setSearchTo(dest.name);
                                    enterGuestMode();
                                    navigate('/dashboard');
                                }}
                                className="px-3 py-1.5 glass-panel rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1.5"
                            >
                                <span>{dest.name}</span>
                                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-md">{dest.price}</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </motion.section>

            {/* REAL COST COMPARISON SECTION (Glass cards with lift) */}
            <section className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800/40">
                        Student Economics
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white mt-3 tracking-tight">
                        Why travel solo when you can split?
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-1 max-w-lg mx-auto">
                        Typical one-way trip from VIT-AP to Vijayawada Railway Station:
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                    {/* Without Campus Buddy */}
                    <motion.div 
                        whileHover={{ y: -4 }}
                        className="p-6 sm:p-7 rounded-3xl glass-panel space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Regular Auto / Solo Cab</span>
                            <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-md">Expensive</span>
                        </div>
                        <div className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
                            ₹600 - ₹800
                            <span className="text-xs font-normal text-zinc-500 block mt-1">per person, each one-way trip</span>
                        </div>
                        <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                            <li className="flex items-center gap-2">❌ Haggling with autos outside campus gates</li>
                            <li className="flex items-center gap-2">❌ Traveling alone with unverified strangers</li>
                            <li className="flex items-center gap-2">❌ Huge surge pricing during holidays and exams</li>
                        </ul>
                    </motion.div>

                    {/* With Campus Buddy */}
                    <motion.div 
                        whileHover={{ y: -6, scale: 1.01 }}
                        className="p-6 sm:p-7 rounded-3xl glass-panel border-2 border-blue-600 dark:border-blue-500 space-y-4 relative shadow-xl"
                    >
                        <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[11px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-md">
                            Save Up to 80%
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Campus Travel Buddy</span>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">Smart Choice</span>
                        </div>
                        <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-white">
                            ₹100 - ₹150
                            <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400 block mt-1">split evenly between 4 classmates</span>
                        </div>
                        <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                            <li className="flex items-center gap-2">✅ 100% Verified university email holders</li>
                            <li className="flex items-center gap-2">✅ Coordinate via WhatsApp before leaving campus</li>
                            <li className="flex items-center gap-2">✅ Direct drop right at your railway platform or terminal</li>
                        </ul>
                    </motion.div>
                </div>
            </section>

            {/* TRUST & SAFETY PILLARS */}
            <section className="max-w-5xl mx-auto space-y-10">
                <div className="text-center max-w-xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
                        Built on Campus Trust
                    </h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 font-medium">
                        Unlike public ride apps, everyone on Campus Travel Buddy belongs to your college community.
                    </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                    {[
                        {
                            icon: <Shield size={22} />,
                            color: 'text-blue-600 bg-blue-500/10',
                            title: 'University SSO Gated',
                            desc: 'Signups are restricted to @vitapstudent.ac.in emails. Random outsiders cannot view or join student rides.'
                        },
                        {
                            icon: <Lock size={22} />,
                            color: 'text-emerald-600 bg-emerald-500/10',
                            title: 'Guarded Phone Privacy',
                            desc: 'Phone numbers stay private on public feeds. Contact details unlock only once a seat booking is mutually confirmed.'
                        },
                        {
                            icon: <MessageCircle size={22} />,
                            color: 'text-cyan-600 bg-cyan-500/10',
                            title: 'Direct WhatsApp Sync',
                            desc: 'Confirmed passengers get a 1-tap WhatsApp button to instantly message the driver and sync on gate meetup points.'
                        },
                    ].map((card, i) => (
                        <motion.div 
                            key={i}
                            whileHover={{ y: -5 }}
                            className="p-6 rounded-3xl glass-panel space-y-3"
                        >
                            <div className={`w-11 h-11 ${card.color} rounded-2xl flex items-center justify-center`}>
                                {card.icon}
                            </div>
                            <h3 className="font-bold text-base text-zinc-950 dark:text-white">{card.title}</h3>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {card.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS (3 Simple Steps) */}
            <section className="max-w-4xl mx-auto glass-panel p-8 sm:p-12 rounded-3xl">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white">
                        How It Works in 3 Steps
                    </h2>
                </div>

                <div className="grid sm:grid-cols-3 gap-6 text-center">
                    <div className="space-y-2.5">
                        <div className="w-11 h-11 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl flex items-center justify-center font-black mx-auto text-sm shadow-md">
                            1
                        </div>
                        <h4 className="font-bold text-sm text-zinc-950 dark:text-white">Offer or Find</h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            Have extra car seats or want to split an auto? Post your trip or search by destination.
                        </p>
                    </div>

                    <div className="space-y-2.5">
                        <div className="w-11 h-11 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl flex items-center justify-center font-black mx-auto text-sm shadow-md">
                            2
                        </div>
                        <h4 className="font-bold text-sm text-zinc-950 dark:text-white">Claim Seat Instantly</h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            One click reserves your seat. Driver contact details and WhatsApp button unlock immediately.
                        </p>
                    </div>

                    <div className="space-y-2.5">
                        <div className="w-11 h-11 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl flex items-center justify-center font-black mx-auto text-sm shadow-md">
                            3
                        </div>
                        <h4 className="font-bold text-sm text-zinc-950 dark:text-white">Meet & Split</h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            Meet at the campus gate, enjoy the commute with friends, and split the cost via UPI.
                        </p>
                    </div>
                </div>
            </section>

            {/* FREQUENTLY ASKED QUESTIONS */}
            <section className="max-w-3xl mx-auto space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-1">Everything you need to know about campus carpooling</p>
                </div>

                <div className="space-y-3">
                    {[
                        { 
                            q: 'Can this be used for auto-rickshaw sharing as well as personal cars?', 
                            a: 'Yes! Over 60% of our rides are auto-splits where students group up at the main gate to split an auto fare to the railway station or bus terminal.' 
                        },
                        { 
                            q: 'How does payment work?', 
                            a: 'There is zero commission on the app. Passengers pay their agreed share directly to the ride host via UPI (Google Pay, PhonePe, Paytm) after completing the trip.' 
                        },
                        { 
                            q: 'What if my lecture gets delayed and I have to cancel?', 
                            a: 'You can cancel your seat reservation with one click from your Profile page. The seat is instantly restored to other students on the feed.' 
                        },
                        { 
                            q: 'Why do I need a university email to sign up?', 
                            a: 'Restricting access to verified college domain accounts guarantees that every user is an authenticated student from our campus community.' 
                        },
                    ].map((item, idx) => (
                        <div 
                            key={idx} 
                            className="glass-panel rounded-2xl overflow-hidden transition-colors"
                        >
                            <button
                                type="button"
                                onClick={() => toggleFaq(idx)}
                                className="w-full p-4 sm:p-5 text-left font-bold text-sm text-zinc-950 dark:text-white flex justify-between items-center"
                            >
                                <span>{item.q}</span>
                                <ChevronDown 
                                    size={16} 
                                    className={`transition-transform duration-200 text-zinc-400 ${openFaq === idx ? 'rotate-180 text-blue-600' : ''}`} 
                                />
                            </button>
                            {openFaq === idx && (
                                <div className="px-4 sm:px-5 pb-5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-200/50 dark:border-zinc-800/80 pt-3">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* FINAL CTA BANNER */}
            <motion.section 
                whileHover={{ scale: 1.01 }}
                className="max-w-4xl mx-auto glass-panel p-8 sm:p-14 rounded-3xl text-center space-y-6 shadow-2xl border-2 border-blue-600/30"
            >
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
                    Ready to make your campus commute effortless?
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
                    Join hundreds of students saving money and traveling together every week.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <Link 
                        to="/signup" 
                        className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-sm shadow-md"
                    >
                        Create Free Account
                    </Link>
                    <button 
                        type="button"
                        onClick={() => {
                            enterGuestMode();
                            window.location.href = '/dashboard';
                        }}
                        className="px-6 py-3.5 glass-panel text-zinc-900 dark:text-zinc-200 font-bold rounded-xl transition text-sm hover:bg-white/80 dark:hover:bg-zinc-800"
                    >
                        Try Guest Demo Mode
                    </button>
                </div>
            </motion.section>

            {/* FOOTER */}
            <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 pt-8 pb-10 text-center space-y-3">
                <div className="flex items-center justify-center gap-2.5">
                    <CampusLogo size={24} />
                    <span className="font-extrabold text-sm text-zinc-950 dark:text-white">Campus Travel Buddy</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    A non-profit peer carpool initiative built by Harsh for college students.
                </p>
                <div className="flex justify-center items-center gap-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 pt-2">
                    <a 
                        href="https://github.com/Harsh007engineering/campus-travel-buddy" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-blue-600 flex items-center gap-1"
                    >
                        <Code2 size={14} /> GitHub Repository
                    </a>
                </div>
            </footer>
        </div>
    );
};

function App() {
  return (
    <Router>
      <div className="relative min-h-screen flex flex-col bg-zinc-50 dark:bg-[#050507] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
        <InteractiveBackground />
        <Toaster 
          position="top-center" 
          reverseOrder={false} 
          toastOptions={{
            duration: 4000,
            style: { 
              borderRadius: '16px',
              fontWeight: '600',
              fontSize: '13px',
              border: '1px solid #e4e4e7',
            }
          }} 
        /> 
        
        <Navbar /> 
        
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;