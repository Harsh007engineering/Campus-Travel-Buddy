import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
    Calendar, Clock, Search, ShieldCheck, Car, Lock, MapPin, 
    Loader2, Sparkles, Phone, MessageCircle, X, Users, ArrowRight,
    CheckCircle2, ChevronRight, Calculator, ShieldAlert, IndianRupee,
    ArrowLeftRight, Luggage, Radio, SlidersHorizontal, PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../config/api';
import { 
    isGuestUser, getGuestTrips, createGuestTrip, joinGuestTrip,
    getGuestRequests, createGuestRequest
} from '../data/demoData';
import FareCalculatorModal from '../components/FareCalculatorModal';
import SafetyToolkitModal from '../components/SafetyToolkitModal';
import UpiPaymentModal from '../components/UpiPaymentModal';

const Dashboard = () => {
    // State
    const [trips, setTrips] = useState([]);
    const [requests, setRequests] = useState([]);
    const [activeFeedTab, setActiveFeedTab] = useState('rides'); // 'rides' | 'requests'
    
    // Filters & Sorts
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('all'); // all, today, tomorrow
    const [filterVehicle, setFilterVehicle] = useState('all'); // all, Car, Auto, Cab
    const [sortBy, setSortBy] = useState('earliest'); // earliest, cheap, seats

    // Modals
    const [showCalculator, setShowCalculator] = useState(false);
    const [showSafety, setShowSafety] = useState(false);
    const [activeSafetyTrip, setActiveSafetyTrip] = useState(null);
    const [upiModalTrip, setUpiModalTrip] = useState(null);
    const [showRequestModal, setShowRequestModal] = useState(false);

    // Form States
    const [isPosting, setIsPosting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [newTrip, setNewTrip] = useState({
        source: 'VIT-AP Main Gate',
        destination: '',
        date: '',
        time: '',
        availableSeats: 3,
        costPerPerson: 120,
        vehicleType: 'Car',
        luggage: 'Standard',
        preferences: ['AC', 'Music'],
        pickupLandmark: '',
        notes: ''
    });

    const [newRequest, setNewRequest] = useState({
        source: 'VIT-AP Campus',
        destination: '',
        date: '',
        time: '',
        seatsNeeded: 1,
        notes: ''
    });

    const currentUser = JSON.parse(localStorage.getItem('user'));
    const isGuest = isGuestUser();

    useEffect(() => {
        fetchTrips();
        fetchRequests();
    }, []);

    const fetchTrips = async () => {
        setIsLoading(true);
        if (isGuest) {
            setTimeout(() => {
                setTrips(getGuestTrips());
                setIsLoading(false);
            }, 150);
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

    const fetchRequests = () => {
        if (isGuest) {
            setRequests(getGuestRequests());
        }
    };

    // Swap Source & Destination
    const handleSwapLocations = () => {
        setNewTrip(prev => ({
            ...prev,
            source: prev.destination || 'VIT-AP Main Gate',
            destination: prev.source || 'Vijayawada'
        }));
    };

    const handlePostTrip = async (e) => {
        e.preventDefault();
        setIsPosting(true);

        if (isGuest) {
            try {
                createGuestTrip(newTrip, currentUser);
                toast.success('Trip published! (Demo Mode) 🚗');
                setNewTrip({
                    source: 'VIT-AP Main Gate',
                    destination: '',
                    date: '',
                    time: '',
                    availableSeats: 3,
                    costPerPerson: 120,
                    vehicleType: 'Car',
                    luggage: 'Standard',
                    preferences: ['AC', 'Music'],
                    pickupLandmark: '',
                    notes: ''
                });
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
            setNewTrip({
                source: 'VIT-AP Main Gate',
                destination: '',
                date: '',
                time: '',
                availableSeats: 3,
                costPerPerson: 120,
                vehicleType: 'Car',
                luggage: 'Standard',
                preferences: ['AC', 'Music'],
                pickupLandmark: '',
                notes: ''
            });
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

    const handlePostRequest = (e) => {
        e.preventDefault();
        if (isGuest) {
            createGuestRequest(newRequest, currentUser);
            toast.success('Ride request broadcasted to campus! 📣');
            setNewRequest({ source: 'VIT-AP Campus', destination: '', date: '', time: '', seatsNeeded: 1, notes: '' });
            setShowRequestModal(false);
            fetchRequests();
            return;
        }
        toast.success('Request broadcasted! (Active in live feed)');
        setShowRequestModal(false);
    };

    const togglePreference = (pref) => {
        setNewTrip(prev => {
            const exists = prev.preferences.includes(pref);
            return {
                ...prev,
                preferences: exists 
                    ? prev.preferences.filter(p => p !== pref) 
                    : [...prev.preferences, pref]
            };
        });
    };

    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    // Filter & Sort Logic
    const filteredTrips = trips.filter(trip => {
        const matchesSearch = 
            trip.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.notes?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (!matchesSearch) return false;

        if (filterDate === 'today' && trip.date !== todayStr) return false;
        if (filterDate === 'tomorrow' && trip.date !== tomorrowStr) return false;

        if (filterVehicle !== 'all' && (trip.vehicleType || 'Car') !== filterVehicle) return false;

        return true;
    }).sort((a, b) => {
        if (sortBy === 'cheap') return a.costPerPerson - b.costPerPerson;
        if (sortBy === 'seats') return b.availableSeats - a.availableSeats;
        // Default: earliest date + time
        return (a.date + a.time).localeCompare(b.date + b.time);
    });

    const inputClass = "w-full px-3.5 py-2 rounded-xl border bg-white/70 dark:bg-zinc-950/70 border-zinc-200/80 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-xs shadow-xs";

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* TOP UTILITY ACTION BAR */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 glass-panel p-3.5 sm:p-4 rounded-2xl shadow-xs">
                {/* Left: Tab Switcher (Available Rides vs Ride Requests) */}
                <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setActiveFeedTab('rides')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                            activeFeedTab === 'rides'
                                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs'
                                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                        }`}
                    >
                        <Car size={14} /> Available Rides ({trips.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveFeedTab('requests')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                            activeFeedTab === 'requests'
                                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs'
                                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                        }`}
                    >
                        <Radio size={14} className="text-blue-600 animate-pulse" /> Need a Ride? ({requests.length})
                    </button>
                </div>

                {/* Right: Quick Tools (Fare Split Calculator & Campus SOS) */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={() => setShowCalculator(true)}
                        className="flex-1 sm:flex-initial px-3 py-1.5 glass-panel hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                        <Calculator size={14} className="text-blue-600" /> Fare Split Calculator
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setActiveSafetyTrip(null);
                            setShowSafety(true);
                        }}
                        className="flex-1 sm:flex-initial px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-rose-200/80 dark:border-rose-900/40 shadow-xs"
                    >
                        <ShieldAlert size={14} className="text-rose-600" /> Campus Safety & SOS
                    </button>
                </div>
            </div>

            {/* GUEST MODE BANNER */}
            {isGuest && (
                <div className="glass-panel border-amber-500/30 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-amber-500 text-white rounded-lg shrink-0 shadow-xs">
                            <Sparkles size={15} />
                        </div>
                        <div>
                            <span className="font-bold text-amber-900 dark:text-amber-200">Guest Demo Mode: </span>
                            <span className="text-amber-800/80 dark:text-amber-300/80">
                                Testing simulated campus trips. Real database and student privacy are fully protected.
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                        }} 
                        className="shrink-0 px-3 py-1 bg-amber-200/60 hover:bg-amber-200 text-amber-950 dark:bg-amber-950/60 dark:text-amber-200 rounded-lg text-xs font-bold transition"
                    >
                        Exit Demo
                    </button>
                </div>
            )}

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* OFFER A RIDE SIDEBAR CARD */}
                <div className="lg:col-span-4 glass-panel p-5 sm:p-6 rounded-3xl shadow-xl lg:sticky lg:top-24 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-200/60 dark:border-zinc-800/80">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-xl shadow-xs">
                                <Car size={17} />
                            </div>
                            <h3 className="font-bold text-sm sm:text-base text-zinc-950 dark:text-white">Offer a Ride</h3>
                        </div>
                        <button
                            type="button"
                            onClick={handleSwapLocations}
                            title="Swap Origin & Destination"
                            className="p-1.5 text-zinc-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                        >
                            <ArrowLeftRight size={14} />
                        </button>
                    </div>

                    <form onSubmit={handlePostTrip} className="space-y-3">
                        {/* Vehicle Type Selector */}
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
                                Mode / Vehicle Type
                            </label>
                            <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                                {[
                                    { id: 'Car', label: '🚗 Car' },
                                    { id: 'Auto', label: '🛺 Auto' },
                                    { id: 'Cab', label: '🚕 Cab' },
                                    { id: 'Bike', label: '🏍️ Bike' },
                                ].map(v => (
                                    <button
                                        key={v.id}
                                        type="button"
                                        onClick={() => setNewTrip({...newTrip, vehicleType: v.id})}
                                        className={`py-1.5 rounded-lg transition text-[11px] ${
                                            newTrip.vehicleType === v.id
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'glass-panel text-zinc-600 dark:text-zinc-400 hover:border-zinc-400'
                                        }`}
                                    >
                                        {v.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* From & To with Swap */}
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
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
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
                                Destination (To)
                            </label>
                            <input 
                                type="text" 
                                placeholder="e.g. Vijayawada Railway Stn" 
                                required 
                                value={newTrip.destination} 
                                onChange={e => setNewTrip({...newTrip, destination: e.target.value})} 
                                className={inputClass} 
                            />
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
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
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
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

                        {/* Seats & Cost */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
                                    Seats Available
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
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
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

                        {/* Luggage Allowance */}
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
                                Luggage Space
                            </label>
                            <div className="flex gap-2">
                                {[
                                    { id: 'Standard', label: '🎒 Backpack only' },
                                    { id: 'Suitcase', label: '🧳 Luggage / Trolley' },
                                ].map(l => (
                                    <button
                                        key={l.id}
                                        type="button"
                                        onClick={() => setNewTrip({...newTrip, luggage: l.id})}
                                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition ${
                                            newTrip.luggage === l.id
                                                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                                                : 'glass-panel text-zinc-600 dark:text-zinc-400'
                                        }`}
                                    >
                                        {l.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Ride Preferences */}
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
                                Preferences / Tags
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {['AC', 'Music', 'Girls-Only', 'Quiet'].map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => togglePreference(tag)}
                                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition ${
                                            newTrip.preferences.includes(tag)
                                                ? 'bg-blue-600 text-white'
                                                : 'glass-panel text-zinc-600 dark:text-zinc-400'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            disabled={isPosting} 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition shadow-md shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2 active:scale-95 flex items-center justify-center gap-2 text-xs"
                        >
                            {isPosting ? (
                                <><Loader2 size={15} className="animate-spin" /> Publishing...</>
                            ) : (
                                <>Publish Ride <ArrowRight size={14} /></>
                            )}
                        </button>
                    </form>
                </div>

                {/* MAIN FEED SECTION */}
                <div className="lg:col-span-8 space-y-5">
                    {/* Search, Filter & Sort Bar */}
                    <div className="glass-panel p-4 rounded-2xl space-y-3 shadow-xs">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search by destination (e.g. Vijayawada, Airport, Guntur)..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                                className="w-full pl-9 pr-8 py-2 bg-white/70 dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-900 dark:text-white placeholder-zinc-400 outline-none focus:ring-2 focus:ring-blue-600" 
                            />
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm('')} 
                                    className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>

                        {/* Filter Chips & Sorter Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                            {/* Date Filter */}
                            <div className="flex items-center gap-1">
                                {[
                                    { id: 'all', label: 'All Dates' },
                                    { id: 'today', label: 'Today' },
                                    { id: 'tomorrow', label: 'Tomorrow' },
                                ].map(d => (
                                    <button
                                        key={d.id}
                                        type="button"
                                        onClick={() => setFilterDate(d.id)}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                                            filterDate === d.id
                                                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                                                : 'glass-panel text-zinc-600 dark:text-zinc-400 hover:border-zinc-400'
                                        }`}
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            </div>

                            {/* Vehicle Filter */}
                            <div className="flex items-center gap-1">
                                {['all', 'Car', 'Auto', 'Cab'].map(v => (
                                    <button
                                        key={v}
                                        type="button"
                                        onClick={() => setFilterVehicle(v)}
                                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                                            filterVehicle === v
                                                ? 'bg-blue-600 text-white'
                                                : 'glass-panel text-zinc-600 dark:text-zinc-400'
                                        }`}
                                    >
                                        {v === 'all' ? 'All Types' : v}
                                    </button>
                                ))}
                            </div>

                            {/* Sorter */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-2 py-1 bg-white/70 dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-700 dark:text-zinc-300 outline-none"
                            >
                                <option value="earliest">Earliest Departure</option>
                                <option value="cheap">Lowest Cost</option>
                                <option value="seats">Most Open Seats</option>
                            </select>
                        </div>
                    </div>

                    {/* TAB 1: AVAILABLE RIDES FEED */}
                    {activeFeedTab === 'rides' && (
                        <div className="space-y-3.5">
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

                            {!isLoading && filteredTrips.length === 0 && (
                                <div className="text-center py-14 glass-panel rounded-3xl p-6 space-y-3">
                                    <MapPin size={32} className="text-zinc-300 dark:text-zinc-700 mx-auto" />
                                    <h4 className="font-bold text-zinc-950 dark:text-white text-base">No upcoming rides match your filter</h4>
                                    <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                                        Need a ride right now? Broadcast a request to fellow students using the "Need a Ride" tab!
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setShowRequestModal(true)}
                                        className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs"
                                    >
                                        Post a Ride Request
                                    </button>
                                </div>
                            )}

                            {!isLoading && filteredTrips.map((trip) => {
                                const isCreator = currentUser && trip.creator && trip.creator._id === currentUser.id;
                                const isPassenger = currentUser && trip.passengers?.some(p => p._id === currentUser.id);
                                const hasJoinedOrCreated = isCreator || isPassenger;

                                const cleanPhone = trip.creator?.phone?.replace(/\s+/g, '') || '';
                                const waLink = `https://wa.me/${cleanPhone.startsWith('+') ? cleanPhone.slice(1) : cleanPhone}?text=Hi%20${encodeURIComponent(trip.creator?.name || 'Driver')},%20regarding%20our%20ride%20to%20${encodeURIComponent(trip.destination)}!`;

                                return (
                                    <motion.div 
                                        whileHover={{ y: -2 }}
                                        key={trip._id} 
                                        className={`glass-panel p-5 rounded-2xl transition-all shadow-md space-y-3.5 ${
                                            isCreator ? 'border-blue-500/80 ring-1 ring-blue-500/20' : ''
                                        }`}
                                    >
                                        {/* Row 1: Badges & Price */}
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold rounded-md text-[10px]">
                                                        {trip.vehicleType === 'Auto' ? '🛺 Auto Share' : trip.vehicleType === 'Cab' ? '🚕 Cab Pool' : '🚗 Carpool'}
                                                    </span>
                                                    {trip.luggage === 'Suitcase' && (
                                                        <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold rounded-md text-[10px] flex items-center gap-1">
                                                            <Luggage size={11} /> Luggage Allowed
                                                        </span>
                                                    )}
                                                    {trip.preferences?.map(p => (
                                                        <span key={p} className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold rounded text-[9px]">
                                                            {p}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Origin ➔ Destination */}
                                                <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-zinc-950 dark:text-white pt-0.5">
                                                    <span>{trip.source}</span>
                                                    <ChevronRight size={16} className="text-zinc-400 shrink-0" />
                                                    <span>{trip.destination}</span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 font-medium">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={13} className="text-blue-600" /> {trip.date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={13} className="text-blue-600" /> {trip.time}
                                                    </span>
                                                    {trip.pickupLandmark && (
                                                        <span className="text-[11px] text-zinc-400 font-normal">
                                                            📍 {trip.pickupLandmark}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <div className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-500">
                                                    ₹{trip.costPerPerson}
                                                </div>
                                                <span className="text-[10px] text-zinc-400 block">per head</span>
                                            </div>
                                        </div>

                                        {/* Notes if provided */}
                                        {trip.notes && (
                                            <p className="text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50/70 dark:bg-zinc-950/70 p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800 italic">
                                                "{trip.notes}"
                                            </p>
                                        )}

                                        {/* Row 2: Driver & Actions */}
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                                    {trip.creator?.name?.charAt(0) || 'D'}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-zinc-950 dark:text-white leading-tight">
                                                        {trip.creator?.name || 'Student Host'}
                                                    </p>
                                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                                                        <ShieldCheck size={11} /> Verified Peer
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
                                                <span className="text-xs font-bold text-zinc-500">
                                                    {trip.availableSeats} {trip.availableSeats === 1 ? 'seat' : 'seats'} left
                                                </span>

                                                {!isCreator && !isPassenger && trip.availableSeats > 0 && (
                                                    <button 
                                                        onClick={() => handleJoinTrip(trip._id)} 
                                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-xs shadow-sm active:scale-95"
                                                    >
                                                        Claim Seat
                                                    </button>
                                                )}

                                                {!isCreator && isPassenger && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold rounded-lg text-xs flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/40">
                                                            <CheckCircle2 size={12} /> Riding
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setUpiModalTrip(trip)}
                                                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                                                        >
                                                            <IndianRupee size={12} /> Pay UPI
                                                        </button>
                                                    </div>
                                                )}

                                                {isCreator && (
                                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-lg text-xs">
                                                        Your Trip
                                                    </span>
                                                )}

                                                {trip.availableSeats === 0 && !isPassenger && !isCreator && (
                                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 font-bold rounded-lg text-xs">
                                                        Full
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Unlocked Contact Details for Confirmed Passengers */}
                                        {hasJoinedOrCreated && trip.creator && (
                                            <div className="p-3 bg-zinc-50/80 dark:bg-zinc-950/80 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-2 text-xs">
                                                <div className="flex justify-between items-center text-zinc-500 font-medium">
                                                    <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                                                        <Lock size={11} /> Driver Contact Details
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveSafetyTrip(trip);
                                                            setShowSafety(true);
                                                        }}
                                                        className="text-blue-600 dark:text-blue-400 text-[11px] font-bold hover:underline flex items-center gap-1"
                                                    >
                                                        <ShieldAlert size={11} /> Share for Safety
                                                    </button>
                                                </div>

                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-0.5">
                                                    <div>
                                                        <span className="text-zinc-500">Phone: </span>
                                                        <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 ml-1">
                                                            {trip.creator.phone || 'N/A'}
                                                        </span>
                                                    </div>

                                                    {trip.creator.phone && (
                                                        <div className="flex items-center gap-2">
                                                            <a 
                                                                href={`tel:${cleanPhone}`} 
                                                                className="px-2.5 py-1 glass-panel text-zinc-800 dark:text-zinc-200 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-zinc-200 transition"
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
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* TAB 2: RIDE REQUESTS (NEED A RIDE) BOARD */}
                    {activeFeedTab === 'requests' && (
                        <div className="space-y-3.5">
                            <div className="flex justify-between items-center glass-panel p-4 rounded-2xl">
                                <div>
                                    <h4 className="text-sm font-bold text-zinc-950 dark:text-white">Passenger Request Board</h4>
                                    <p className="text-xs text-zinc-500">Students actively looking for rides or co-travelers</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowRequestModal(true)}
                                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                                >
                                    <PlusCircle size={14} /> Broadcast Request
                                </button>
                            </div>

                            {requests.map(req => {
                                const reqPhone = req.user?.phone?.replace(/\s+/g, '') || '';
                                const reqWa = `https://wa.me/${reqPhone.startsWith('+') ? reqPhone.slice(1) : reqPhone}?text=Hi%20${encodeURIComponent(req.user?.name || 'Student')},%20I%20saw%20your%20ride%20request%20to%20${encodeURIComponent(req.destination)}!`;

                                return (
                                    <div key={req._id} className="glass-panel p-5 rounded-2xl space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 font-bold text-base text-zinc-950 dark:text-white">
                                                    <span>{req.source}</span>
                                                    <ChevronRight size={15} className="text-zinc-400" />
                                                    <span>{req.destination}</span>
                                                </div>
                                                <div className="flex gap-3 text-xs text-zinc-500 mt-1">
                                                    <span className="flex items-center gap-1"><Calendar size={13} /> {req.date}</span>
                                                    <span className="flex items-center gap-1"><Clock size={13} /> {req.time}</span>
                                                </div>
                                            </div>
                                            <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md text-xs font-bold">
                                                Needs {req.seatsNeeded} {req.seatsNeeded === 1 ? 'seat' : 'seats'}
                                            </span>
                                        </div>

                                        {req.notes && (
                                            <p className="text-xs text-zinc-600 dark:text-zinc-400 italic bg-zinc-50 dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                                "{req.notes}"
                                            </p>
                                        )}

                                        <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-full flex items-center justify-center font-bold text-xs">
                                                    {req.user?.name?.charAt(0) || 'U'}
                                                </div>
                                                <span className="text-xs font-bold text-zinc-900 dark:text-white">{req.user?.name}</span>
                                            </div>

                                            <a
                                                href={reqWa}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                                            >
                                                <MessageCircle size={13} /> Offer Pick-up
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL 1: FARE SPLIT CALCULATOR */}
            <FareCalculatorModal
                isOpen={showCalculator}
                onClose={() => setShowCalculator(false)}
                onApplyToForm={(calculatedData) => {
                    setNewTrip(prev => ({
                        ...prev,
                        source: calculatedData.source,
                        destination: calculatedData.destination,
                        costPerPerson: calculatedData.costPerPerson,
                        availableSeats: calculatedData.availableSeats,
                    }));
                    toast.success('Calculated fare applied to Offer Ride form! 🧮');
                }}
            />

            {/* MODAL 2: SAFETY & SOS TOOLKIT */}
            <SafetyToolkitModal
                isOpen={showSafety}
                onClose={() => setShowSafety(false)}
                activeTrip={activeSafetyTrip}
            />

            {/* MODAL 3: UPI PAYMENT */}
            <UpiPaymentModal
                isOpen={Boolean(upiModalTrip)}
                onClose={() => setUpiModalTrip(null)}
                trip={upiModalTrip}
            />

            {/* MODAL 4: BROADCAST RIDE REQUEST (PASSENGER) */}
            {showRequestModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setShowRequestModal(false)}>
                    <div 
                        className="glass-panel p-6 rounded-3xl w-full max-w-md shadow-2xl space-y-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center pb-2 border-b border-zinc-200/60 dark:border-zinc-800/80">
                            <h3 className="font-bold text-base text-zinc-950 dark:text-white">Broadcast Ride Request</h3>
                            <button onClick={() => setShowRequestModal(false)} className="text-zinc-400 hover:text-zinc-600">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handlePostRequest} className="space-y-3">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Pick-up Location</label>
                                <input type="text" required value={newRequest.source} onChange={e => setNewRequest({...newRequest, source: e.target.value})} className={inputClass} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Destination</label>
                                <input type="text" placeholder="e.g. Hyderabad Airport" required value={newRequest.destination} onChange={e => setNewRequest({...newRequest, destination: e.target.value})} className={inputClass} />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Date</label>
                                    <input type="date" required value={newRequest.date} onChange={e => setNewRequest({...newRequest, date: e.target.value})} className={inputClass} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Time</label>
                                    <input type="time" required value={newRequest.time} onChange={e => setNewRequest({...newRequest, time: e.target.value})} className={inputClass} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Seats Needed</label>
                                <input type="number" min="1" max="5" required value={newRequest.seatsNeeded} onChange={e => setNewRequest({...newRequest, seatsNeeded: e.target.value})} className={inputClass} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Notes / Details</label>
                                <textarea rows="2" placeholder="e.g. 2 bags, looking to share auto fare" value={newRequest.notes} onChange={e => setNewRequest({...newRequest, notes: e.target.value})} className={inputClass} />
                            </div>

                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition text-xs shadow-md mt-1">
                                Broadcast Request
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;