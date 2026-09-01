import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { CarFront, Shield, IndianRupee, Users, MapPin, Zap } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#110c2e] via-[#0b0914] to-[#05040a] text-slate-200 font-sans">
        <Toaster position="top-center" reverseOrder={false} toastOptions={{
          style: { background: '#1e1b4b', color: '#fff', border: '1px solid #3730a3' }
        }} /> 
        
        <Navbar /> 
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={
              <div className="space-y-24">
                {/* Hero Section */}
                <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 border border-brand/30 rounded-full text-brand text-sm font-medium mb-8">
                    <Zap size={16} /> Built for VIT-AP Students
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                    Share the ride.<br/>
                    <span className="text-brand">Split the cost.</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-purple-200/60 mb-10 max-w-2xl leading-relaxed">
                    The exclusive, secure carpooling network for campus students. Find travel partners, share rides, and make your commute affordable.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href="/signup" className="px-8 py-3.5 bg-brand text-white font-semibold rounded-full hover:bg-purple-500 transition shadow-lg shadow-brand/30 text-lg">Get Started Free</a>
                    <a href="/login" className="px-8 py-3.5 bg-[#1a1635] text-white font-semibold rounded-full border border-purple-900/50 hover:bg-[#251f47] transition text-lg">Login</a>
                  </div>
                </div>

                {/* Features Section */}
                <div className="pb-16">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Why Campus Travel Buddy?</h2>
                    <p className="text-purple-200/50 max-w-xl mx-auto">Everything you need for safe, affordable campus travel</p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { icon: <MapPin size={28} />, title: 'Find Rides Easily', desc: 'Search for travel buddies going your way with just a few clicks. Filter by date, time, and destination.' },
                      { icon: <Shield size={28} />, title: 'Trusted Community', desc: 'Only verified VIT-AP students can join. Your safety is our top priority with verified profiles.' },
                      { icon: <IndianRupee size={28} />, title: 'Save Money', desc: 'Split travel costs fairly among co-passengers. Save up to 70% on every trip.' },
                      { icon: <Users size={28} />, title: 'Build Connections', desc: 'Meet fellow students, make friends, and build your campus network while traveling.' },
                      { icon: <CarFront size={28} />, title: 'Offer or Join', desc: 'Have a car? Offer rides. Need one? Join existing trips. It works both ways.' },
                      { icon: <Zap size={28} />, title: 'Instant Booking', desc: 'Join a ride with one click. No waiting, no hassle. Just tap and go.' },
                    ].map((feature, i) => (
                      <div key={i} className="bg-[#1a1635]/60 backdrop-blur-sm p-6 rounded-2xl border border-purple-900/30 hover:border-brand/40 transition-all duration-300 hover:shadow-lg hover:shadow-brand/5 group">
                        <div className="w-12 h-12 bg-brand/10 text-brand rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand group-hover:text-white transition-all duration-300">
                          {feature.icon}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-purple-200/50 text-sm leading-relaxed">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-purple-900/30 pt-8 pb-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="bg-brand text-white p-1.5 rounded-lg">
                      <CarFront size={18} />
                    </div>
                    <span className="font-bold text-white">Campus Travel Buddy</span>
                  </div>
                  <p className="text-sm text-slate-500">Built with ❤️ for VIT-AP students</p>
                  <p className="text-xs text-slate-600 mt-2">© 2025 Campus Travel Buddy. All rights reserved.</p>
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