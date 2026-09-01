import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
    Calendar, Clock, Search, ShieldCheck, Car, Lock, MapPin, 
    Loader2, Sparkles, Phone, MessageCircle, X, Users, IndianRupee, ArrowRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../config/api';
import { isGuestUser, getGuestTrips, createGuestTrip, joinGuestTrip } from '../data/demoData';

const Dashboard = () => {
    const [trips, setTrips] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all'); // all, today, affordable
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
            }, 250);
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
                toast.success('Successfully joined the ride (Demo)! 🎉');
                fetchTrips();
            } catch (err) {
                toast.error(err.message || 'Failed to join trip');
            }
            return;
        }

        try {
            const res = await api.post(`/trips/join/${tripId}`);
            toast.success(res.data.message || 'Joined trip successfully!');
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
        if (filterCategory === 'affordable') {
            return trip.costPerPerson <= 150;
        }
        return true;
    });

    const inputClass = "w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-[#110c2e] border-slate-200 dark:border-purple-900/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-indigo-300/30 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition text-sm";

    // Skeleton loader component
    const TripSkeleton = () => (
        <div className="bg-white dark:bg-[#15102a]/80 p-6 rounded-3xl border border-slate-200 dark:border-purple-900/40 animate-pulse space-y-4">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <div className="h-5 w-52 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded"></div>
                </div>
                <div className="h-10 w-16 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full"></div>
            <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="h-9 w-28 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Guest Mode Banner */}
            {isGuest && (
                <div className="bg-gradient-to-r from-amber-500/10 via-brand/10 to-indigo-500/10 dark:from-brand/20 dark:via-purple-900/30 dark:to-indigo-900/20 border border-amber-500/30 dark:border-brand/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm backdrop-blur-md">
                    <div className="flex items-center gap-3 text-sm text-slate-800 dark:text-purple-200">
                        <div className="p-2.5 bg-brand text-white rounded-xl shadow-md shrink-0">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                                Guest Demo Mode Active
                                <span className="text-[10px] uppercase font-extrabold bg-brand/20 text-brand px-2 py-0.5 rounded-full">Preview</span>
                            </p>
                            <p className="text-xs text-slate-600 dark:text-purple-300/80 mt-0.5">
                                You are exploring with isolated simulated rides. Feel free to publish trips, join seats, and test features! Real student data is protected.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                        }} 
                        className="shrink-0 px-4 py-2 bg-white dark:bg-purple-900/40 hover:bg-slate-100 dark:hover:bg-purple-800/50 text-slate-700 dark:text-purple-200 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs font-bold border border-slate-200 dark:border-purple-700/50 transition shadow-sm"
                    >
                        Exit Demo Mode
                    </button>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                
                {/* POST TRIP CARD (Sidebar) */}
                <div className="lg:col-span-1 bg-white dark:bg-[#15102a]/80 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-purple-900/40 shadow-sm dark:shadow-2xl lg:sticky lg:top-24">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <div className="p-2 bg-brand/10 dark:bg-brand/20 text-brand rounded-xl">
                                <Car size={20} />
                            </div>
                            Offer a Ride
                        </h3>
                        <span className="text-[11px] font-bold text-brand bg-brand/10 dark:bg-brand/20 px-2.5 py-1 rounded-full">
                            Driver Mode
                        </span>
                    </div>

                    <form onSubmit={handlePostTrip} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-600 dark:text-purple-300/70 uppercase tracking-wider mb-1 block">
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
                            <label className="text-xs font-bold text-slate-600 dark:text-purple-300/70 uppercase tracking-wider mb-1 block">
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

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-slate-600 dark:text-purple-300/70 uppercase tracking-wider mb-1 block">
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
                                <label className="text-xs font-bold text-slate-600 dark:text-purple-300/70 uppercase tracking-wider mb-1 block">
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

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-slate-600 dark:text-purple-300/70 uppercase tracking-wider mb-1 block">
                                    Open Seats
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
                                <label className="text-xs font-bold text-slate-600 dark:text-purple-300/70 uppercase tracking-wider mb-1 block">
                                    Cost / Seat (₹)
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
                            className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-brand/25 disabled:opacity-60 disabled:cursor-not-allowed mt-2 active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isPosting ? (
                                <><Loader2 size={18} className="animate-spin" /> Publishing...</>
                            ) : (
                                <>Publish Ride <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>
                </div>

                {/* TRIP LIST & SEARCH SECTION */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Search & Filter Bar */}
                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="absolute left-4 top-3.5 text-slate-400 dark:text-purple-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search by destination or pickup point..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                                className="w-full pl-12 pr-10 py-3.5 bg-white dark:bg-[#15102a] border border-slate-200 dark:border-purple-900/40 rounded-2xl shadow-sm focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/40" 
                            />
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm('')} 
                                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        {/* Filter category pills */}
                        <div className="flex flex-wrap gap-2 pt-1">
                            {[
                                { id: 'all', label: 'All Rides' },
                                { id: 'today', label: 'Departing Today' },
                                { id: 'affordable', label: 'Under ₹150' },
                            ].map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setFilterCategory(cat.id)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                                        filterCategory === cat.id
                                            ? 'bg-brand text-white shadow-sm'
                                            : 'bg-white dark:bg-[#15102a] text-slate-600 dark:text-purple-300/70 border border-slate-200 dark:border-purple-900/30 hover:border-brand/40'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                            <span className="ml-auto text-xs font-semibold text-slate-400 dark:text-purple-300/40 self-center">
                                {filteredTrips.length} {filteredTrips.length === 1 ? 'ride' : 'rides'} available
                            </span>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="space-y-4">
                            <TripSkeleton />
                            <TripSkeleton />
                            <TripSkeleton />
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && filteredTrips.length === 0 && (
                        <div className="text-center py-16 bg-white dark:bg-[#15102a]/40 rounded-3xl border border-slate-200 dark:border-purple-900/30 p-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 dark:bg-[#110c2e] rounded-3xl mb-4 border border-slate-200 dark:border-purple-900/40">
                                <MapPin size={36} className="text-brand/60" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                {searchTerm ? 'No matching rides found' : 'No upcoming rides posted'}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-purple-300/60 max-w-sm mx-auto mb-6">
                                {searchTerm ? 'Try adjusting your search keywords or removing filters.' : 'Be the first student to publish a carpool or auto-share trip!'}
                            </p>
                        </div>
                    )}

                    {/* Trip Cards Feed */}
                    <AnimatePresence>
                    <div className="space-y-4">
                        {!isLoading && filteredTrips.map((trip, index) => {
                            const isCreator = currentUser && trip.creator && trip.creator._id === currentUser.id;
                            const isPassenger = currentUser && trip.passengers?.some(p => p._id === currentUser.id);
                            const hasJoinedOrCreated = isCreator || isPassenger;

                            const filledSeats = (trip.passengers?.length || 0) + 1;
                            const totalSeats = trip.availableSeats + (trip.passengers?.length || 0) + 1;
                            const fillPercentage = totalSeats > 0 ? (filledSeats / totalSeats) * 100 : 0;

                            const cleanPhone = trip.creator?.phone?.replace(/\s+/g, '') || '';
                            const waLink = `https://wa.me/${cleanPhone.startsWith('+') ? cleanPhone.slice(1) : cleanPhone}?text=Hi%20${encodeURIComponent(trip.creator?.name || 'Driver')},%20I'm%20joining%20your%20Campus%20Travel%20Buddy%20trip%20to%20${encodeURIComponent(trip.destination)}!`;

                            return (
                                <motion.div 
                                    initial={{ opacity: 0, y: 15 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ duration: 0.25, delay: index * 0.04 }} 
                                    key={trip._id} 
                                    className={`bg-white dark:bg-[#15102a]/80 backdrop-blur-md p-6 rounded-3xl border transition-all duration-200 shadow-sm dark:shadow-xl ${
                                        isCreator 
                                            ? 'border-brand ring-1 ring-brand/30' 
                                            : 'border-slate-200 dark:border-purple-900/40 hover:border-brand/40'
                                    }`}
                                >
                                    {/* Trip Header */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start mb-5 gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-brand/10 dark:bg-[#110c2e] rounded-2xl border border-brand/20 dark:border-purple-900/50 text-brand">
                                                <Car size={22} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex-wrap">
                                                    <span>{trip.source}</span>
                                                    <span className="text-slate-400 dark:text-purple-500/60 font-normal">➔</span>
                                                    <span>{trip.destination}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-purple-200/70 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} className="text-brand" /> {trip.date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} className="text-brand" /> {trip.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-brand text-white px-4 py-2 rounded-2xl shadow-md shadow-brand/20 self-end sm:self-auto shrink-0">
                                            <div className="text-lg font-black flex items-center">
                                                ₹{trip.costPerPerson}
                                                <span className="text-[10px] font-normal opacity-80 ml-1">/seat</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Seat Progress Bar */}
                                    <div className="mb-5 bg-slate-50 dark:bg-[#110c2e]/60 p-3.5 rounded-2xl border border-slate-100 dark:border-purple-900/30">
                                        <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-purple-300/70 uppercase tracking-wider mb-2">
                                            <span className="flex items-center gap-1">
                                                <Users size={13} className="text-brand" /> Seat Occupancy
                                            </span>
                                            <span className="font-extrabold text-slate-800 dark:text-white">
                                                {filledSeats} / {totalSeats} ({trip.availableSeats} open)
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-[#110c2e] rounded-full h-2 overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }} 
                                                animate={{ width: `${fillPercentage}%` }} 
                                                transition={{ duration: 0.6 }} 
                                                className={`h-full rounded-full ${
                                                    trip.availableSeats === 0 
                                                        ? 'bg-rose-500' 
                                                        : 'bg-gradient-to-r from-brand to-indigo-500'
                                                }`}
                                            ></motion.div>
                                        </div>
                                    </div>

                                    {/* Host & Actions */}
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50 dark:bg-[#110c2e] p-4 rounded-2xl border border-slate-200/80 dark:border-purple-900/30">
                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                            <div className="w-10 h-10 bg-gradient-to-tr from-brand to-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                                                {trip.creator?.name?.charAt(0) || 'D'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                                    {trip.creator?.name || 'Campus Student'}
                                                </p>
                                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                                                    <ShieldCheck size={13} /> Verified Peer
                                                </p>
                                            </div>
                                        </div>

                                        <div className="w-full sm:w-auto flex justify-end">
                                            {!isCreator && !isPassenger && trip.availableSeats > 0 && (
                                                <button 
                                                    onClick={() => handleJoinTrip(trip._id)} 
                                                    className="w-full sm:w-auto px-6 py-2.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl transition-all shadow-md shadow-brand/20 active:scale-95 text-sm"
                                                >
                                                    Claim Seat
                                                </button>
                                            )}

                                            {!isCreator && isPassenger && (
                                                <div className="px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-emerald-500/20">
                                                    <ShieldCheck size={15} /> Seat Confirmed
                                                </div>
                                            )}

                                            {isCreator && (
                                                <div className="px-4 py-2 bg-brand/10 dark:bg-purple-900/40 text-brand dark:text-purple-200 font-bold rounded-xl text-xs border border-brand/20 dark:border-purple-700/50">
                                                    Your Hosted Trip
                                                </div>
                                            )}

                                            {trip.availableSeats === 0 && !isPassenger && !isCreator && (
                                                <div className="px-4 py-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold rounded-xl text-xs border border-rose-200 dark:border-rose-500/20">
                                                    Ride Full
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Unlocked Contact Details for Confirmed Co-Travelers */}
                                    {hasJoinedOrCreated && trip.creator && (
                                        <div className="bg-slate-50 dark:bg-[#0b0914] p-4 sm:p-5 rounded-2xl mt-4 border border-slate-200 dark:border-purple-900/30 space-y-3">
                                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-purple-900/30 pb-3">
                                                <span className="text-xs font-bold text-brand uppercase tracking-wider flex items-center gap-1.5">
                                                    <Lock size={14} /> Confirmed Travel Group
                                                </span>
                                                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                    Unlocked ✓
                                                </span>
                                            </div>

                                            {/* Driver Contact & Quick Actions */}
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
                                                <div className="text-xs">
                                                    <span className="text-slate-500 dark:text-purple-300/70 font-semibold">Driver Contact: </span>
                                                    <span className="font-mono font-bold text-slate-800 dark:text-emerald-400 ml-1">
                                                        {trip.creator.phone || 'Phone upon request'}
                                                    </span>
                                                </div>

                                                {trip.creator.phone && (
                                                    <div className="flex items-center gap-2 self-end sm:self-auto">
                                                        <a 
                                                            href={`tel:${cleanPhone}`} 
                                                            className="p-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white rounded-lg hover:bg-brand hover:text-white transition text-xs flex items-center gap-1 px-2.5 font-bold"
                                                        >
                                                            <Phone size={13} /> Call
                                                        </a>
                                                        <a 
                                                            href={waLink} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition text-xs flex items-center gap-1 px-2.5 font-bold shadow-sm"
                                                        >
                                                            <MessageCircle size={13} /> WhatsApp
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Co-passengers list */}
                                            {trip.passengers?.length > 0 && (
                                                <div className="pt-2">
                                                    <strong className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-purple-400/60 block mb-2 font-bold">
                                                        Co-Passengers ({trip.passengers.length}):
                                                    </strong>
                                                    <ul className="space-y-1.5">
                                                        {trip.passengers.map(p => (
                                                            <li key={p._id} className="flex justify-between items-center bg-white dark:bg-[#161233] p-2.5 rounded-xl border border-slate-200 dark:border-purple-900/40 text-xs">
                                                                <span className="font-bold text-slate-900 dark:text-white">{p.name}</span>
                                                                <span className="font-mono text-emerald-600 dark:text-emerald-400">{p.phone}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
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