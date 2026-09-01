import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { 
    CarFront, Shield, IndianRupee, Users, MapPin, Zap, Sparkles, 
    ArrowRight, CheckCircle2, MessageCircle, Clock, Heart, Code2 
} from 'lucide-react';
import { enterGuestMode } from './data/demoData';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090714] text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Toaster 
          position="top-center" 
          reverseOrder={false} 
          toastOptions={{
            duration: 4000,
            style: { 
              borderRadius: '16px',
              fontWeight: '600',
              fontSize: '14px',
            }
          }} 
        /> 
        
        <Navbar /> 
        
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <Routes>
            <Route path="/" element={
              <div className="space-y-24 sm:space-y-32">
                {/* Hero Section */}
                <section className="relative pt-6 sm:pt-12 pb-12 sm:pb-20 text-center flex flex-col items-center justify-center">
                  {/* Ambient Glows */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[550px] h-72 sm:h-[550px] bg-brand/15 dark:bg-brand/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
                  
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand/10 dark:bg-brand/20 border border-brand/30 dark:border-brand/40 rounded-full text-brand dark:text-purple-300 text-xs sm:text-sm font-bold mb-8 shadow-sm">
                    <Zap size={15} className="text-brand" /> The Official Student Carpooling Network
                  </div>
                  
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6 max-w-4xl leading-[1.1]">
                    Share the ride.<br/>
                    <span className="bg-gradient-to-r from-brand via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                      Split the cost.
                    </span>
                  </h1>
                  
                  <p className="text-lg sm:text-xl text-slate-600 dark:text-purple-200/70 mb-10 max-w-2xl font-medium leading-relaxed">
                    Connecting verified campus students for daily commutes, weekend trips, and railway/airport transfers. Safe, affordable, and 100% peer-to-peer.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-center justify-center w-full max-w-lg">
                    <Link 
                      to="/signup" 
                      className="w-full sm:w-auto px-8 py-4 bg-brand hover:bg-brand-hover text-white font-bold rounded-2xl transition-all shadow-lg shadow-brand/30 text-base flex items-center justify-center gap-2 group active:scale-95"
                    >
                      Get Started Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    
                    <Link 
                      to="/login" 
                      className="w-full sm:w-auto px-7 py-4 bg-white dark:bg-[#15102a] text-slate-800 dark:text-white font-bold rounded-2xl border border-slate-200 dark:border-purple-900/60 hover:border-brand/40 transition text-base shadow-sm active:scale-95"
                    >
                      Sign In
                    </Link>

                    <button 
                      type="button"
                      onClick={() => {
                        enterGuestMode();
                        window.location.href = '/dashboard';
                      }}
                      className="w-full sm:w-auto px-6 py-4 bg-indigo-50 dark:bg-purple-950/50 hover:bg-indigo-100 dark:hover:bg-purple-900/50 text-indigo-700 dark:text-purple-200 font-bold rounded-2xl border border-indigo-200 dark:border-purple-700/40 transition text-base flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                    >
                      <Sparkles size={18} className="text-brand" /> Try Demo Mode
                    </button>
                  </div>

                  {/* Popular Campus Routes Showcase */}
                  <div className="mt-14 sm:mt-18 w-full max-w-3xl bg-white/70 dark:bg-[#15102a]/70 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-purple-900/40 shadow-xl">
                    <div className="text-xs font-bold text-slate-500 dark:text-purple-300/60 uppercase tracking-wider mb-3 text-left flex items-center gap-2">
                      <MapPin size={14} className="text-brand" /> Popular Student Commutes
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-left">
                      {[
                        { from: 'VIT-AP Gate 1', to: 'Vijayawada Stn', price: '₹120', time: '45 mins' },
                        { from: 'VIT-AP Campus', to: 'Guntur Bus Stand', price: '₹80', time: '35 mins' },
                        { from: 'Campus Block', to: 'Hyderabad Airport', price: '₹650', time: '4.5 hrs' },
                      ].map((route, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 dark:bg-[#0f0b22] rounded-xl border border-slate-200/80 dark:border-purple-900/30 flex justify-between items-center hover:border-brand/40 transition">
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{route.from} ➔ {route.to}</p>
                            <p className="text-[11px] text-slate-500 dark:text-purple-300/50 mt-0.5">{route.time}</p>
                          </div>
                          <span className="text-xs font-extrabold text-brand bg-brand/10 dark:bg-brand/20 px-2.5 py-1 rounded-lg">
                            {route.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Campus Metrics Bar */}
                <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
                  {[
                    { label: 'Rides Coordinated', value: '500+' },
                    { label: 'Student Commute Savings', value: '₹2.5L+' },
                    { label: 'Campus Students', value: '1,200+' },
                    { label: 'Platform Commission', value: '0%' },
                  ].map((stat, i) => (
                    <div key={i} className="p-6 bg-white dark:bg-[#15102a]/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-purple-900/40 shadow-sm dark:shadow-lg">
                      <div className="text-2xl sm:text-4xl font-black text-brand mb-1">{stat.value}</div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-purple-200/70">{stat.label}</div>
                    </div>
                  ))}
                </section>

                {/* Bento Features Grid */}
                <section className="space-y-8">
                  <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                      Engineered for Campus Life
                    </h2>
                    <p className="text-slate-600 dark:text-purple-200/60 text-base font-medium">
                      Built to make student transportation safe, affordable, and delightfully simple.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { 
                        icon: <Shield size={26} />, 
                        title: 'Verified Students Only', 
                        desc: 'Access is restricted to official university domains (@vitapstudent.ac.in). Say goodbye to suspicious strangers.' 
                      },
                      { 
                        icon: <IndianRupee size={26} />, 
                        title: 'Equal Cost Splitting', 
                        desc: 'Divide fuel and toll expenses fairly among peers. Save up to 75% compared to private autos or cabs.' 
                      },
                      { 
                        icon: <Users size={26} />, 
                        title: 'Interactive Seat Tracking', 
                        desc: 'Live seat counts and progress meters prevent overbooking and give instant booking certainty.' 
                      },
                      { 
                        icon: <CheckCircle2 size={26} />, 
                        title: 'Guarded Privacy', 
                        desc: 'Personal phone numbers and contact details stay hidden until a ride is mutually confirmed.' 
                      },
                      { 
                        icon: <MessageCircle size={26} />, 
                        title: 'One-Tap WhatsApp Pickup', 
                        desc: 'Confirmed passengers can connect with the driver on WhatsApp with one click to coordinate exact pickup spots.' 
                      },
                      { 
                        icon: <Sparkles size={26} />, 
                        title: 'Guest Demo Preview', 
                        desc: 'Recruiters and external visitors can test the entire carpooling workflow with rich simulated data.' 
                      },
                    ].map((feature, i) => (
                      <div 
                        key={i} 
                        className="bg-white dark:bg-[#15102a]/70 backdrop-blur-sm p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-purple-900/30 hover:border-brand/40 transition-all duration-300 hover:shadow-xl group"
                      >
                        <div className="w-12 h-12 bg-brand/10 dark:bg-brand/20 text-brand rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200">
                          {feature.icon}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                        <p className="text-slate-600 dark:text-purple-200/60 text-sm leading-relaxed">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* How It Works Section */}
                <section className="bg-white dark:bg-[#15102a]/50 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-purple-900/40 shadow-sm">
                  <div className="text-center max-w-xl mx-auto mb-10">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">How It Works in 3 Steps</h2>
                    <p className="text-slate-600 dark:text-purple-200/60 text-sm">Simple, swift, and designed around campus schedules.</p>
                  </div>
                  
                  <div className="grid sm:grid-cols-3 gap-8 text-center relative">
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-brand text-white rounded-2xl flex items-center justify-center font-black mx-auto shadow-md shadow-brand/20 text-lg">1</div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">Offer or Discover</h4>
                      <p className="text-xs text-slate-600 dark:text-purple-200/60 leading-relaxed">Drivers publish available seats. Passengers search by destination and departure time.</p>
                    </div>

                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-brand text-white rounded-2xl flex items-center justify-center font-black mx-auto shadow-md shadow-brand/20 text-lg">2</div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">Instant Seat Booking</h4>
                      <p className="text-xs text-slate-600 dark:text-purple-200/60 leading-relaxed">One tap to claim a seat. Contact details unlock instantly for coordinate pickups.</p>
                    </div>

                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-brand text-white rounded-2xl flex items-center justify-center font-black mx-auto shadow-md shadow-brand/20 text-lg">3</div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">Travel & Split</h4>
                      <p className="text-xs text-slate-600 dark:text-purple-200/60 leading-relaxed">Meet at the designated campus gate, enjoy the ride with fellow students, and split the cost.</p>
                    </div>
                  </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-slate-200 dark:border-purple-900/30 pt-10 pb-8 text-center space-y-4">
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="bg-brand text-white p-2 rounded-xl shadow-md">
                      <CarFront size={20} />
                    </div>
                    <span className="font-extrabold text-lg text-slate-900 dark:text-white">Campus Travel Buddy</span>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-purple-300/60 max-w-md mx-auto">
                    A peer-to-peer carpooling initiative dedicated to student convenience, safety, and community bonding.
                  </p>

                  <div className="flex justify-center items-center gap-6 pt-2">
                    <a 
                      href="https://github.com/Harsh007engineering/campus-travel-buddy" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs font-semibold text-slate-600 dark:text-purple-300/70 hover:text-brand flex items-center gap-1.5 transition"
                    >
                      <Code2 size={15} /> GitHub Repository
                    </a>
                  </div>

                  <p className="text-[11px] text-slate-400 dark:text-purple-300/40 pt-4">
                    © {new Date().getFullYear()} Campus Travel Buddy. Crafted with ❤️ for university students.
                  </p>
                </footer>
              </div>
            } />
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