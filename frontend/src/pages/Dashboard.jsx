import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
    Calendar, Clock, Search, ShieldCheck, Car, Lock, MapPin, 
    Loader2, Sparkles, Phone, MessageCircle, X, Users, ArrowRight,
    CheckCircle2, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../config/api';
import { isGuestUser, getGuestTrips, createGuestTrip, joinGuestTrip } from '../data/demoData';

const Dashboard = () => {
    const [trips, setTrips] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [isPosting, setIsPosting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [newTrip, setNewTrip] = useState({
        source: '', destination: '', date: '', time: '', availableSeats: 3, costPerPerson: 100
    });

    const currentUser = JSON.parse(localStorage.getItem('user'));
    const isGuest = isGuestUser();

    useEffect(() => { fetchTrips(); }, []);

    const fetchTrips = async () => {
        setIsLoading(true);
        if (isGuest) {
            setTimeout(() => {
                setTrips(getGuestTrips());
                setIsLoading(false);
            }, 200);
            return;
        }

        try {
            const res = await api.get('/trips/all');
            setTrips(res.data);
        } catch (err) {
            toast.error('Failed to load trips');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostTrip = async (e) => {
        e.preventDefault();
        setIsPosting(true);

        if (isGuest) {
            try {
                createGuestTrip(newTrip, currentUser);
                toast.success('Trip published in Demo Mode! 🚗');
                setNewTrip({source: '', destination: '', date: '', time: '', availableSeats: 3, costPerPerson: 100});
                fetchTrips();
            } catch (err) {
                toast.error(err.message || 'Failed to post trip');
            } finally {
                setIsPosting(false);
            }
            return;
        }

        try {
            await api.post('/trips/create', newTrip);
            toast.success('Trip posted successfully! 🚗');
            setNewTrip({source: '', destination: '', date: '', time: '', availableSeats: 3, costPerPerson: 100});
            fetchTrips();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to post trip.');
        } finally {
            setIsPosting(false);
        }
    };

    const handleJoinTrip = async (tripId) => {
        if (isGuest) {
            try {
                joinGuestTrip(tripId, currentUser);
                toast.success('Seat confirmed! (Demo Mode) 🎉');
                fetchTrips();
            } catch (err) {
                toast.error(err.message || 'Failed to join trip');
            }
            return;
        }

        try {
            const res = await api.post(`/trips/join/${tripId}`);
            toast.success(res.data.message || 'Seat confirmed! 🎉');
            fetchTrips();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to join trip');
        }
    };

    const todayStr = new Date().toISOString().split('T')[0];

    const filteredTrips = trips.filter(trip => {
        const matchesSearch = 
            trip.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.source?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (!matchesSearch) return false;

        if (filterCategory === 'today') {
            return trip.date === todayStr;
        }
        if (filterCategory === 'cheap') {
            return trip.costPerPerson <= 120;
        }
        return true;
    });

    const inputClass = "w-full px-3.5 py-2.5 rounded-xl border bg-white/70 dark:bg-zinc-950/70 border-zinc-200/80 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-sm shadow-xs";

    return (
        <div className="relative space-y-6 sm:space-y-8">
            {/* Ambient Background Glows */}
            <div className="absolute top-10 right-[-80px] w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-blob-1"></div>
            <div className="absolute top-96 left-[-100px] w-96 h-96 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none -z-10 animate-blob-2"></div>

            {/* GUEST MODE NOTIFICATION BANNER */}
            {isGuest && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0 shadow-xs">
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <span className="font-bold text-amber-900 dark:text-amber-200">Guest Demo Mode: </span>
                            <span className="text-amber-800/80 dark:text-amber-300/80 text-xs sm:text-sm">
                                You are testing with simulated campus rides. Real student accounts and phone numbers are protected.
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                        }} 
                        className="shrink-0 px-3.5 py-1.5 bg-amber-200/60 hover:bg-amber-200 text-amber-950 dark:bg-amber-950/60 dark:text-amber-200 rounded-lg text-xs font-bold transition shadow-xs"
                    >
                        Exit Demo
                    </button>
                </motion.div>
            )}

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* OFFER A RIDE FORM (Sidebar Glass Panel) */}
                <motion.div 
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-4 glass-panel p-6 rounded-3xl shadow-xl lg:sticky lg:top-24"
                >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-200/60 dark:border-zinc-800/80">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-xl shadow-xs">
                                <Car size={18} />
                            </div>
                            <h3 className="font-bold text-base text-zinc-950 dark:text-white">Offer a Ride</h3>
                        </div>
                        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md">
                            Post Trip
                        </span>
                    </div>

                    <form onSubmit={handlePostTrip} className="space-y-3.5">
                        <div>
                            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
                                Pick-up (From)
                            </label>
                            <input 
                                type="text" 
                                placeholder="e.g. VIT-AP Main Gate" 
                                required 
                                value={newTrip.source} 
                                onChange={e => setNewTrip({...newTrip, source: e.target.value})} 
                                className={inputClass} 
                            />
                        </div>

                        <div>
                            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
                                Destination (To)
                            </label>
                            <input 
                                type="text" 
                                placeholder="e.g. Vijayawada Station" 
                                required 
                                value={newTrip.destination} 
                                onChange={e => setNewTrip({...newTrip, destination: e.target.value})} 
                                className={inputClass} 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                            <div>
                                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
                                    Date
                                </label>
                                <input 
                                    type="date" 
                                    required 
                                    value={newTrip.date} 
                                    onChange={e => setNewTrip({...newTrip, date: e.target.value})} 
                                    className={inputClass} 
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
                                    Time
                                </label>
                                <input 
                                    type="time" 
                                    required 
                                    value={newTrip.time} 
                                    onChange={e => setNewTrip({...newTrip, time: e.target.value})} 
                                    className={inputClass} 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                            <div>
                                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
                                    Seats
                                </label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="6" 
                                    required 
                                    value={newTrip.availableSeats} 
                                    onChange={e => setNewTrip({...newTrip, availableSeats: e.target.value})} 
                                    className={inputClass} 
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
                                    Fare / Seat (₹)
                                </label>
                                <input 
                                    type="number" 
                                    min="0" 
                                    required 
                                    value={newTrip.costPerPerson} 
                                    onChange={e => setNewTrip({...newTrip, costPerPerson: e.target.value})} 
                                    className={inputClass} 
                                />
                            </div>
                        </div>

                        <button 
                            disabled={isPosting} 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-md shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2 active:scale-95 flex items-center justify-center gap-2 text-sm"
                        >
                            {isPosting ? (
                                <><Loader2 size={16} className="animate-spin" /> Publishing...</>
                            ) : (
                                <>Publish Ride <ArrowRight size={15} /></>
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* TRIP SEARCH & FEED (Main Area) */}
                <div className="lg:col-span-8 space-y-5">
                    {/* Search & Filter Header (Glass panel) */}
                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3.5 top-3 text-zinc-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search by destination or pickup point..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                                className="w-full pl-10 pr-9 py-2.5 glass-panel rounded-xl shadow-xs focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-sm font-medium text-zinc-900 dark:text-white placeholder-zinc-400" 
                            />
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm('')} 
                                    className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                            {[
                                { id: 'all', label: 'All Trips' },
                                { id: 'today', label: 'Departing Today' },
                                { id: 'cheap', label: 'Under ₹120' },
                            ].map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setFilterCategory(cat.id)}
                                    className={`px-3 py-1.5 rounded-lg transition shadow-xs ${
                                        filterCategory === cat.id
                                            ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold'
                                            : 'glass-panel text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                            <span className="ml-auto text-zinc-400 dark:text-zinc-500 font-medium">
                                {filteredTrips.length} available
                            </span>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="space-y-3">
                            {[1, 2, 3].map(n => (
                                <div key={n} className="glass-panel p-5 rounded-2xl animate-pulse space-y-3">
                                    <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                                    <div className="h-3 w-32 bg-zinc-100 dark:bg-zinc-800/60 rounded"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && filteredTrips.length === 0 && (
                        <div className="text-center py-14 glass-panel rounded-3xl p-6 space-y-2">
                            <MapPin size={32} className="text-zinc-300 dark:text-zinc-700 mx-auto" />
                            <h4 className="font-bold text-zinc-900 dark:text-white text-base">No upcoming rides match</h4>
                            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                                Be the first to publish a ride on this route using the form on the left!
                            </p>
                        </div>
                    )}

                    {/* TRIP CARDS LIST (Framer Motion Stagger + Glass) */}
                    <AnimatePresence>
                    <div className="space-y-3.5">
                        {!isLoading && filteredTrips.map((trip, idx) => {
                            const isCreator = currentUser && trip.creator && trip.creator._id === currentUser.id;
                            const isPassenger = currentUser && trip.passengers?.some(p => p._id === currentUser.id);
                            const hasJoinedOrCreated = isCreator || isPassenger;

                            const cleanPhone = trip.creator?.phone?.replace(/\s+/g, '') || '';
                            const waLink = `https://wa.me/${cleanPhone.startsWith('+') ? cleanPhone.slice(1) : cleanPhone}?text=Hi%20${encodeURIComponent(trip.creator?.name || 'Driver')},%20joining%20your%20ride%20to%20${encodeURIComponent(trip.destination)}!`;

                            return (
                                <motion.div 
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                                    whileHover={{ y: -3, scale: 1.008 }}
                                    key={trip._id} 
                                    className={`glass-panel p-5 rounded-2xl transition-all shadow-md ${
                                        isCreator 
                                            ? 'border-blue-500/80 ring-1 ring-blue-500/20' 
                                            : 'hover:border-blue-500/40'
                                    }`}
                                >
                                    {/* Route & Price Row */}
                                    <div className="flex justify-between items-start gap-3 mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                                                <span>{trip.source}</span>
                                                <ChevronRight size={16} className="text-zinc-400 shrink-0" />
                                                <span>{trip.destination}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={13} className="text-blue-600" /> {trip.date}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={13} className="text-blue-600" /> {trip.time}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <div className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-500">
                                                ₹{trip.costPerPerson}
                                            </div>
                                            <span className="text-[11px] text-zinc-500 block">per seat</span>
                                        </div>
                                    </div>

                                    {/* Driver & Actions Row */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/80">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                                {trip.creator?.name?.charAt(0) || 'D'}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-zinc-950 dark:text-white leading-tight">
                                                    {trip.creator?.name || 'Student Host'}
                                                </p>
                                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
                                                    <ShieldCheck size={11} /> Verified Peer
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                                            <span className="text-xs font-bold text-zinc-500">
                                                {trip.availableSeats} {trip.availableSeats === 1 ? 'seat' : 'seats'} left
                                            </span>

                                            {!isCreator && !isPassenger && trip.availableSeats > 0 && (
                                                <motion.button 
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleJoinTrip(trip._id)} 
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-xs shadow-sm"
                                                >
                                                    Claim Seat
                                                </motion.button>
                                            )}

                                            {!isCreator && isPassenger && (
                                                <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold rounded-lg text-xs flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/40">
                                                    <CheckCircle2 size={13} /> Booked
                                                </div>
                                            )}

                                            {isCreator && (
                                                <div className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-lg text-xs">
                                                    Your Hosted Trip
                                                </div>
                                            )}

                                            {trip.availableSeats === 0 && !isPassenger && !isCreator && (
                                                <div className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 font-bold rounded-lg text-xs">
                                                    Trip Full
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Unlocked Contact Details for Confirmed Co-Travelers */}
                                    {hasJoinedOrCreated && trip.creator && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-3.5 p-3.5 bg-zinc-50/80 dark:bg-zinc-950/80 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-2 text-xs"
                                        >
                                            <div className="flex justify-between items-center text-zinc-500 font-medium">
                                                <span className="text-[11px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                                                    <Lock size={12} /> Contact Details (Mutual)
                                                </span>
                                                <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                                                    Confirmed ✓
                                                </span>
                                            </div>

                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
                                                <div>
                                                    <span className="text-zinc-500">Host Phone: </span>
                                                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 ml-1">
                                                        {trip.creator.phone || 'N/A'}
                                                    </span>
                                                </div>

                                                {trip.creator.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <a 
                                                            href={`tel:${cleanPhone}`} 
                                                            className="px-2.5 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg font-bold hover:bg-zinc-300 transition text-xs flex items-center gap-1"
                                                        >
                                                            <Phone size={12} /> Call
                                                        </a>
                                                        <a 
                                                            href={waLink} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition text-xs flex items-center gap-1 shadow-xs"
                                                        >
                                                            <MessageCircle size={12} /> WhatsApp
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            {trip.passengers?.length > 0 && (
                                                <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80">
                                                    <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                                                        Co-Passengers ({trip.passengers.length}):
                                                    </span>
                                                    <div className="space-y-1">
                                                        {trip.passengers.map(p => (
                                                            <div key={p._id} className="flex justify-between items-center text-zinc-700 dark:text-zinc-300 text-[11px]">
                                                                <span className="font-semibold">{p.name}</span>
                                                                <span className="font-mono text-zinc-500">{p.phone}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;