import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { 
    Car, Shield, IndianRupee, Users, MapPin, Zap, Sparkles, 
    ArrowRight, CheckCircle2, MessageCircle, Clock, ChevronDown, 
    Code2, Lock, AlertCircle, Compass, Star, TrendingDown
} from 'lucide-react';
import { enterGuestMode } from './data/demoData';

// Landing Page Component
const LandingPage = () => {
    const navigate = useNavigate();
    const [searchTo, setSearchTo] = useState('');
    const [openFaq, setOpenFaq] = useState(null);

    const handleQuickSearch = (e) => {
        e.preventDefault();
        enterGuestMode();
        navigate('/dashboard');
    };

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="space-y-24 sm:space-y-36">
            {/* HERO SECTION */}
            <section className="pt-6 sm:pt-14 pb-8 sm:pb-16 text-center flex flex-col items-center">
                {/* University Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-full text-blue-700 dark:text-blue-400 text-xs sm:text-sm font-bold mb-8 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    Exclusive to Verified VIT-AP University Students
                </div>

                {/* Primary Headline */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-950 dark:text-white mb-6 max-w-4xl leading-[1.08]">
                    Stop overpaying for campus travel.
                    <span className="block text-blue-600 dark:text-blue-500 mt-1">
                        Share verified rides instead.
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl font-normal leading-relaxed">
                    The peer-to-peer carpool and auto-split network for college students. Split fuel costs, travel with verified classmates, and coordinate pickups via WhatsApp in seconds.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center mb-12">
                    <Link 
                        to="/signup" 
                        className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-sm text-base flex items-center justify-center gap-2 active:scale-95"
                    >
                        Sign Up with College ID <ArrowRight size={17} />
                    </Link>

                    <button 
                        type="button"
                        onClick={() => {
                            enterGuestMode();
                            window.location.href = '/dashboard';
                        }}
                        className="px-6 py-3.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 transition text-base flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Sparkles size={16} className="text-amber-500" /> Explore Demo Mode
                    </button>
                </div>

                {/* INTERACTIVE TRIP SEARCH BOX (AirBnB / BlaBlaCar style) */}
                <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl text-left">
                    <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3 flex items-center gap-2">
                        <Compass size={14} className="text-blue-600" /> Quick Trip Finder
                    </div>
                    
                    <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-950/80 rounded-xl border border-zinc-200 dark:border-zinc-800">
                            <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Leaving From</label>
                            <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
                                <MapPin size={16} className="text-blue-600 shrink-0" />
                                <span className="truncate">VIT-AP Campus (Main Gate)</span>
                            </div>
                        </div>

                        <div className="p-3 bg-zinc-50 dark:bg-zinc-950/80 rounded-xl border border-zinc-200 dark:border-zinc-800">
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
                            className="bg-zinc-950 dark:bg-blue-600 hover:bg-zinc-800 dark:hover:bg-blue-700 text-white font-bold rounded-xl px-5 py-3 flex items-center justify-center gap-2 transition text-sm shadow-xs"
                        >
                            Find Available Rides <ArrowRight size={15} />
                        </button>
                    </form>

                    {/* Quick Destination Chips */}
                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs font-semibold">
                        <span className="text-zinc-400 text-[11px] font-bold">POPULAR:</span>
                        {[
                            { name: 'Vijayawada Stn', price: '₹120' },
                            { name: 'Guntur Bus Stand', price: '₹80' },
                            { name: 'Hyderabad Airport', price: '₹650' },
                            { name: 'PVP Square Mall', price: '₹100' },
                        ].map((dest, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => {
                                    setSearchTo(dest.name);
                                    enterGuestMode();
                                    navigate('/dashboard');
                                }}
                                className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 transition flex items-center gap-1.5"
                            >
                                <span>{dest.name}</span>
                                <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400">{dest.price}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* REAL COST COMPARISON SECTION (Why students love this) */}
            <section className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                        Student Economics
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white mt-3 tracking-tight">
                        Why pay solo when you can split?
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-1 max-w-lg mx-auto">
                        A typical trip from VIT-AP to Vijayawada Railway Station or Bus Stand:
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                    {/* Without Campus Buddy */}
                    <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Regular Auto / Solo Cab</span>
                            <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-md">Expensive</span>
                        </div>
                        <div className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
                            ₹600 - ₹800
                            <span className="text-xs font-normal text-zinc-500 block mt-1">per person, each one-way trip</span>
                        </div>
                        <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                            <li className="flex items-center gap-2">❌ Haggling with autos outside campus gates</li>
                            <li className="flex items-center gap-2">❌ Traveling alone with unverified strangers</li>
                            <li className="flex items-center gap-2">❌ Huge surge pricing during holidays and exams</li>
                        </ul>
                    </div>

                    {/* With Campus Buddy */}
                    <div className="p-6 sm:p-7 rounded-2xl bg-blue-50/70 dark:bg-zinc-900 border-2 border-blue-600 dark:border-blue-500 space-y-4 relative shadow-lg">
                        <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[11px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-xs">
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
                        <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                            <li className="flex items-center gap-2">✅ 100% Verified university email holders</li>
                            <li className="flex items-center gap-2">✅ Coordinate via WhatsApp before leaving campus</li>
                            <li className="flex items-center gap-2">✅ Direct drop right at your railway platform or terminal</li>
                        </ul>
                    </div>
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
                    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Shield size={20} />
                        </div>
                        <h3 className="font-bold text-base text-zinc-900 dark:text-white">University SSO Gated</h3>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            Signups are restricted to <code className="text-blue-600 font-semibold">@vitapstudent.ac.in</code> emails. Random outsiders cannot view or join student rides.
                        </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <Lock size={20} />
                        </div>
                        <h3 className="font-bold text-base text-zinc-900 dark:text-white">Guarded Phone Privacy</h3>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            Phone numbers stay private on public feeds. Contact details unlock only once a seat booking is mutually confirmed.
                        </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/50 text-purple-600 rounded-xl flex items-center justify-center">
                            <MessageCircle size={20} />
                        </div>
                        <h3 className="font-bold text-base text-zinc-900 dark:text-white">Direct WhatsApp Sync</h3>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            Confirmed passengers get a 1-tap WhatsApp button to instantly message the driver and sync on gate meetup points.
                        </p>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS (3 Simple Steps) */}
            <section className="max-w-4xl mx-auto bg-zinc-100/70 dark:bg-zinc-900/50 p-8 sm:p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white">
                        How It Works in 3 Steps
                    </h2>
                </div>

                <div className="grid sm:grid-cols-3 gap-6 text-center">
                    <div className="space-y-2.5">
                        <div className="w-10 h-10 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl flex items-center justify-center font-black mx-auto text-sm">
                            1
                        </div>
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Offer or Find</h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            Have extra car seats or want to split an auto? Post your trip or search by destination.
                        </p>
                    </div>

                    <div className="space-y-2.5">
                        <div className="w-10 h-10 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl flex items-center justify-center font-black mx-auto text-sm">
                            2
                        </div>
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Claim Seat Instantly</h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            One click reserves your seat. Driver contact details and WhatsApp button unlock immediately.
                        </p>
                    </div>

                    <div className="space-y-2.5">
                        <div className="w-10 h-10 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl flex items-center justify-center font-black mx-auto text-sm">
                            3
                        </div>
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Meet & Split</h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            Meet at the campus gate, enjoy the commute with friends, and split the cost via UPI.
                        </p>
                    </div>
                </div>
            </section>

            {/* FREQUENTLY ASKED QUESTIONS (Accordion) */}
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
                            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                        >
                            <button
                                type="button"
                                onClick={() => toggleFaq(idx)}
                                className="w-full p-4 sm:p-5 text-left font-bold text-sm text-zinc-900 dark:text-white flex justify-between items-center"
                            >
                                <span>{item.q}</span>
                                <ChevronDown 
                                    size={16} 
                                    className={`transition-transform duration-200 text-zinc-400 ${openFaq === idx ? 'rotate-180 text-blue-600' : ''}`} 
                                />
                            </button>
                            {openFaq === idx && (
                                <div className="px-4 sm:px-5 pb-5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-3">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* FINAL CTA BANNER */}
            <section className="max-w-4xl mx-auto bg-zinc-950 dark:bg-zinc-900 text-white p-8 sm:p-14 rounded-3xl text-center space-y-6 shadow-2xl border border-zinc-800">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                    Ready to make your campus commute effortless?
                </h2>
                <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto">
                    Join hundreds of students saving money and traveling together every week.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <Link 
                        to="/signup" 
                        className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-sm"
                    >
                        Create Free Account
                    </Link>
                    <button 
                        type="button"
                        onClick={() => {
                            enterGuestMode();
                            window.location.href = '/dashboard';
                        }}
                        className="px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl transition text-sm"
                    >
                        Try Guest Demo Mode
                    </button>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-zinc-200 dark:border-zinc-800 pt-8 pb-10 text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                        <Car size={13} />
                    </div>
                    <span className="font-extrabold text-sm text-zinc-900 dark:text-white">Campus Travel Buddy</span>
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
      <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
        <Toaster 
          position="top-center" 
          reverseOrder={false} 
          toastOptions={{
            duration: 4000,
            style: { 
              borderRadius: '12px',
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