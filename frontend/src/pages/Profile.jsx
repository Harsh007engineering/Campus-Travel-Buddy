import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
    Calendar, Clock, Edit2, Trash2, X, UserMinus, Users, Loader2, 
    Sparkles, Phone, MessageCircle, ShieldCheck, Car, ArrowRight 
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../config/api';
import { isGuestUser, getGuestTrips, updateGuestTrip, deleteGuestTrip, leaveGuestTrip } from '../data/demoData';

const Profile = () => {
    const [trips, setTrips] = useState([]);
    const [activeTab, setActiveTab] = useState('hosted'); // 'hosted' or 'joined'
    const [editingTrip, setEditingTrip] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
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
            toast.error('Failed to load your profile data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (tripId) => {
        if (!window.confirm('Are you sure you want to cancel and delete this trip?')) return;
        if (isGuest) {
            deleteGuestTrip(tripId);
            toast.success('Trip deleted! (Demo)');
            fetchTrips();
            return;
        }

        try {
            await api.delete(`/trips/delete/${tripId}`);
            toast.success('Trip deleted!');
            fetchTrips();
        } catch (err) {
            toast.error('Failed to delete trip');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (isGuest) {
            try {
                updateGuestTrip(editingTrip._id, editingTrip);
                toast.success('Trip updated successfully! (Demo)');
                setEditingTrip(null);
                fetchTrips();
            } catch (err) {
                toast.error(err.message || 'Failed to update trip');
            }
            return;
        }

        try {
            await api.put(`/trips/edit/${editingTrip._id}`, editingTrip);
            toast.success('Trip updated successfully!');
            setEditingTrip(null);
            fetchTrips();
        } catch (err) {
            toast.error('Failed to update trip');
        }
    };

    const handleLeaveTrip = async (tripId) => {
        if (!window.confirm('Are you sure you want to cancel your seat on this ride?')) return;
        if (isGuest) {
            try {
                leaveGuestTrip(tripId, currentUser);
                toast.success('You have successfully canceled your seat. (Demo)');
                fetchTrips();
            } catch (err) {
                toast.error(err.message || 'Failed to leave trip');
            }
            return;
        }

        try {
            await api.post(`/trips/leave/${tripId}`);
            toast.success('You have successfully canceled your seat.');
            fetchTrips();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to leave trip');
        }
    };

    const myPostedTrips = trips.filter(trip => trip.creator?._id === currentUser?.id);
    const myJoinedTrips = trips.filter(trip => trip.passengers?.some(p => p._id === currentUser?.id));
    const estimatedSavings = myJoinedTrips.reduce((acc, t) => acc + (t.costPerPerson * 0.7), 0);

    const inputClass = "w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-[#110c2e] border-slate-200 dark:border-purple-900/40 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand outline-none transition";

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
                <Loader2 size={36} className="animate-spin text-brand" />
                <p className="text-sm font-semibold text-slate-500 dark:text-purple-300/60">Loading profile data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Profile Overview Card */}
            <div className="bg-white dark:bg-[#15102a]/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-purple-900/40 shadow-sm dark:shadow-xl flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-tr from-brand to-indigo-500 text-white rounded-3xl flex items-center justify-center text-3xl font-black shadow-lg shadow-brand/20 shrink-0">
                    {currentUser?.name?.charAt(0) || 'U'}
                </div>

                <div className="text-center md:text-left flex-1">
                    <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center md:justify-start">
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                            {currentUser?.name}
                        </h1>
                        {isGuest ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand/10 dark:bg-brand/20 text-brand dark:text-purple-200 border border-brand/30 dark:border-brand/40 rounded-full text-xs font-bold">
                                <Sparkles size={13} /> Demo Guest
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold">
                                <ShieldCheck size={14} /> Verified Student
                            </span>
                        )}
                    </div>

                    <p className="text-slate-500 dark:text-purple-300/70 text-sm font-medium mt-1">
                        {currentUser?.email}
                    </p>
                    <p className="font-mono text-xs font-bold text-slate-700 dark:text-emerald-400 mt-1">
                        {currentUser?.phone || 'No phone registered'}
                    </p>
                </div>

                {/* Metrics Badges */}
                <div className="flex gap-3 text-center w-full md:w-auto justify-center">
                    <div className="flex-1 md:flex-initial bg-slate-50 dark:bg-[#110c2e] px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-purple-900/40 min-w-[100px]">
                        <div className="text-2xl font-black text-brand">{myPostedTrips.length}</div>
                        <div className="text-[11px] text-slate-500 dark:text-purple-300/60 uppercase font-bold tracking-wider mt-0.5">Offered</div>
                    </div>
                    <div className="flex-1 md:flex-initial bg-slate-50 dark:bg-[#110c2e] px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-purple-900/40 min-w-[100px]">
                        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{myJoinedTrips.length}</div>
                        <div className="text-[11px] text-slate-500 dark:text-purple-300/60 uppercase font-bold tracking-wider mt-0.5">Joined</div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-purple-900/40 gap-4">
                <button
                    type="button"
                    onClick={() => setActiveTab('hosted')}
                    className={`pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
                        activeTab === 'hosted'
                            ? 'border-brand text-brand dark:text-white'
                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <Car size={16} /> Hosted Rides ({myPostedTrips.length})
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('joined')}
                    className={`pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
                        activeTab === 'joined'
                            ? 'border-brand text-brand dark:text-white'
                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <Users size={16} /> Joined Rides ({myJoinedTrips.length})
                </button>
            </div>

            {/* TAB CONTENT: HOSTED TRIPS */}
            {activeTab === 'hosted' && (
                <div className="space-y-4">
                    {myPostedTrips.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-[#15102a]/40 rounded-3xl border border-slate-200 dark:border-purple-900/30 p-6">
                            <p className="text-slate-500 dark:text-purple-300/60 font-medium text-sm">
                                You haven't hosted any rides yet. Head over to the Dashboard to publish your first carpool!
                            </p>
                        </div>
                    ) : (
                        myPostedTrips.map(trip => (
                            <div key={trip._id} className="bg-white dark:bg-[#15102a]/80 p-6 rounded-3xl border border-slate-200 dark:border-purple-900/40 shadow-sm dark:shadow-md space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
                                            <span>{trip.source}</span>
                                            <span className="text-slate-400 dark:text-purple-500/60">➔</span>
                                            <span>{trip.destination}</span>
                                        </div>
                                        <div className="flex gap-4 text-xs font-semibold text-slate-500 dark:text-purple-200/70 mt-1">
                                            <span className="flex items-center gap-1"><Calendar size={14} className="text-brand" /> {trip.date}</span>
                                            <span className="flex items-center gap-1"><Clock size={14} className="text-brand" /> {trip.time}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg font-black text-brand">₹{trip.costPerPerson}</span>
                                        <span className="text-xs text-slate-500 dark:text-purple-300/60 block">{trip.availableSeats} seats open</span>
                                    </div>
                                </div>

                                {/* Passenger Roster */}
                                <div className="bg-slate-50 dark:bg-[#110c2e] p-4 rounded-2xl border border-slate-200/70 dark:border-purple-900/30">
                                    <h4 className="text-xs font-bold text-slate-600 dark:text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Users size={14} className="text-brand" /> Confirmed Passengers ({trip.passengers?.length || 0})
                                    </h4>
                                    {trip.passengers?.length > 0 ? (
                                        <ul className="space-y-2">
                                            {trip.passengers.map(p => {
                                                const pPhone = p.phone?.replace(/\s+/g, '') || '';
                                                const wa = `https://wa.me/${pPhone.startsWith('+') ? pPhone.slice(1) : pPhone}?text=Hi%20${encodeURIComponent(p.name)},%20about%20our%20ride%20to%20${encodeURIComponent(trip.destination)}...`;
                                                return (
                                                    <li key={p._id} className="flex justify-between items-center text-xs bg-white dark:bg-[#15102a] p-2.5 rounded-xl border border-slate-200 dark:border-purple-900/30">
                                                        <span className="font-bold text-slate-900 dark:text-white">{p.name}</span>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-mono text-slate-600 dark:text-emerald-400">{p.phone}</span>
                                                            <a href={wa} target="_blank" rel="noopener noreferrer" className="p-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition" title="WhatsApp Passenger">
                                                                <MessageCircle size={13} />
                                                            </a>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-slate-400 dark:text-purple-300/40 italic">No passengers have claimed seats yet.</p>
                                    )}
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-3 pt-2">
                                    <button 
                                        onClick={() => setEditingTrip({...trip})} 
                                        className="flex-1 py-2.5 bg-slate-100 dark:bg-purple-950/40 hover:bg-slate-200 dark:hover:bg-purple-900/50 text-slate-700 dark:text-purple-200 rounded-xl flex items-center justify-center gap-1.5 transition text-xs font-bold border border-slate-200 dark:border-purple-800/40"
                                    >
                                        <Edit2 size={14} /> Edit Details
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(trip._id)} 
                                        className="flex-1 py-2.5 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center gap-1.5 transition text-xs font-bold border border-rose-200 dark:border-rose-500/20"
                                    >
                                        <Trash2 size={14} /> Cancel Trip
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* TAB CONTENT: JOINED TRIPS */}
            {activeTab === 'joined' && (
                <div className="space-y-4">
                    {myJoinedTrips.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-[#15102a]/40 rounded-3xl border border-slate-200 dark:border-purple-900/30 p-6">
                            <p className="text-slate-500 dark:text-purple-300/60 font-medium text-sm">
                                You haven't booked any rides yet. Browse the Dashboard to join fellow students on trips!
                            </p>
                        </div>
                    ) : (
                        myJoinedTrips.map(trip => {
                            const dPhone = trip.creator?.phone?.replace(/\s+/g, '') || '';
                            const wa = `https://wa.me/${dPhone.startsWith('+') ? dPhone.slice(1) : dPhone}?text=Hi%20${encodeURIComponent(trip.creator?.name || 'Driver')},%20I%20have%20joined%20your%20ride%20to%20${encodeURIComponent(trip.destination)}!`;
                            return (
                                <div key={trip._id} className="bg-white dark:bg-[#15102a]/80 p-6 rounded-3xl border border-slate-200 dark:border-purple-900/40 shadow-sm dark:shadow-md space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
                                                <span>{trip.source}</span>
                                                <span className="text-slate-400 dark:text-purple-500/60">➔</span>
                                                <span>{trip.destination}</span>
                                            </div>
                                            <div className="flex gap-4 text-xs font-semibold text-slate-500 dark:text-purple-200/70 mt-1">
                                                <span className="flex items-center gap-1"><Calendar size={14} className="text-brand" /> {trip.date}</span>
                                                <span className="flex items-center gap-1"><Clock size={14} className="text-brand" /> {trip.time}</span>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20">
                                            Seat Confirmed ✓
                                        </div>
                                    </div>

                                    {/* Driver Contact Box with WhatsApp Action */}
                                    <div className="bg-slate-50 dark:bg-[#110c2e] p-4 rounded-2xl border border-slate-200/70 dark:border-purple-900/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                        <div>
                                            <p className="text-[11px] uppercase font-bold text-slate-400 dark:text-purple-400/60">Driver / Host</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{trip.creator?.name}</p>
                                            <p className="text-xs font-mono text-brand font-semibold mt-0.5">{trip.creator?.phone}</p>
                                        </div>

                                        {trip.creator?.phone && (
                                            <div className="flex items-center gap-2">
                                                <a href={`tel:${dPhone}`} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-brand hover:text-white transition">
                                                    <Phone size={13} /> Call
                                                </a>
                                                <a href={wa} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-sm">
                                                    <MessageCircle size={13} /> WhatsApp
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <button 
                                        onClick={() => handleLeaveTrip(trip._id)} 
                                        className="w-full py-2.5 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center gap-1.5 transition text-xs font-bold border border-rose-200 dark:border-rose-500/20"
                                    >
                                        <UserMinus size={14} /> Cancel My Seat
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* EDIT TRIP MODAL */}
            {editingTrip && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingTrip(null)}>
                    <div 
                        className="bg-white dark:bg-[#15102a] p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-brand w-full max-w-md shadow-2xl space-y-5"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Ride</h3>
                            <button onClick={() => setEditingTrip(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <X size={20}/>
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 dark:text-purple-300/70 block mb-1">Date</label>
                                    <input type="date" required value={editingTrip.date} onChange={e => setEditingTrip({...editingTrip, date: e.target.value})} className={inputClass} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 dark:text-purple-300/70 block mb-1">Time</label>
                                    <input type="time" required value={editingTrip.time} onChange={e => setEditingTrip({...editingTrip, time: e.target.value})} className={inputClass} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 dark:text-purple-300/70 block mb-1">Available Seats</label>
                                    <input type="number" min="0" max="6" required value={editingTrip.availableSeats} onChange={e => setEditingTrip({...editingTrip, availableSeats: e.target.value})} className={inputClass} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 dark:text-purple-300/70 block mb-1">Cost / Seat (₹)</label>
                                    <input type="number" min="0" required value={editingTrip.costPerPerson} onChange={e => setEditingTrip({...editingTrip, costPerPerson: e.target.value})} className={inputClass} />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-3 rounded-xl transition shadow-md shadow-brand/20 mt-2">
                                Save Updates
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;