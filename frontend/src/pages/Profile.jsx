import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
    Calendar, Clock, Edit2, Trash2, X, UserMinus, Users, Loader2, 
    Sparkles, Phone, MessageCircle, ShieldCheck, Car, ChevronRight 
} from 'lucide-react';
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
            toast.error('Failed to load profile data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (tripId) => {
        if (!window.confirm('Are you sure you want to cancel and delete this trip?')) return;
        if (isGuest) {
            deleteGuestTrip(tripId);
            toast.success('Trip cancelled (Demo)');
            fetchTrips();
            return;
        }

        try {
            await api.delete(`/trips/delete/${tripId}`);
            toast.success('Trip cancelled');
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
                toast.success('Trip updated (Demo)');
                setEditingTrip(null);
                fetchTrips();
            } catch (err) {
                toast.error(err.message || 'Failed to update trip');
            }
            return;
        }

        try {
            await api.put(`/trips/edit/${editingTrip._id}`, editingTrip);
            toast.success('Trip updated successfully');
            setEditingTrip(null);
            fetchTrips();
        } catch (err) {
            toast.error('Failed to update trip');
        }
    };

    const handleLeaveTrip = async (tripId) => {
        if (!window.confirm('Are you sure you want to cancel your seat?')) return;
        if (isGuest) {
            try {
                leaveGuestTrip(tripId, currentUser);
                toast.success('Seat cancelled (Demo)');
                fetchTrips();
            } catch (err) {
                toast.error(err.message || 'Failed to leave trip');
            }
            return;
        }

        try {
            await api.post(`/trips/leave/${tripId}`);
            toast.success('Seat reservation cancelled');
            fetchTrips();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to leave trip');
        }
    };

    const myPostedTrips = trips.filter(trip => trip.creator?._id === currentUser?.id);
    const myJoinedTrips = trips.filter(trip => trip.passengers?.some(p => p._id === currentUser?.id));

    const inputClass = "w-full px-3.5 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 outline-none transition";

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
                <Loader2 size={32} className="animate-spin text-blue-600" />
                <p className="text-xs font-semibold text-zinc-500">Loading your trips...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {/* Profile Overview Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 sm:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row items-center gap-5">
                <div className="w-16 h-16 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0">
                    {currentUser?.name?.charAt(0) || 'U'}
                </div>

                <div className="text-center sm:text-left flex-1">
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        <h1 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">
                            {currentUser?.name}
                        </h1>
                        {isGuest ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold">
                                <Sparkles size={12} /> Guest Mode
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 rounded-full text-xs font-bold">
                                <ShieldCheck size={13} /> Verified Student
                            </span>
                        )}
                    </div>

                    <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">
                        {currentUser?.email}
                    </p>
                    <p className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300 mt-1">
                        {currentUser?.phone || 'No phone registered'}
                    </p>
                </div>

                {/* Counter Badges */}
                <div className="flex gap-2.5 text-center">
                    <div className="bg-zinc-50 dark:bg-zinc-950 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 min-w-[85px]">
                        <div className="text-xl font-black text-blue-600 dark:text-blue-500">{myPostedTrips.length}</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-0.5">Hosted</div>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-950 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 min-w-[85px]">
                        <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{myJoinedTrips.length}</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-0.5">Joined</div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-4 text-sm">
                <button
                    type="button"
                    onClick={() => setActiveTab('hosted')}
                    className={`pb-3 font-bold border-b-2 transition flex items-center gap-1.5 ${
                        activeTab === 'hosted'
                            ? 'border-blue-600 text-blue-600 dark:text-white dark:border-white'
                            : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                >
                    <Car size={16} /> Hosted Trips ({myPostedTrips.length})
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('joined')}
                    className={`pb-3 font-bold border-b-2 transition flex items-center gap-1.5 ${
                        activeTab === 'joined'
                            ? 'border-blue-600 text-blue-600 dark:text-white dark:border-white'
                            : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                >
                    <Users size={16} /> Joined Trips ({myJoinedTrips.length})
                </button>
            </div>

            {/* TAB: HOSTED TRIPS */}
            {activeTab === 'hosted' && (
                <div className="space-y-3.5">
                    {myPostedTrips.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                            <p className="text-zinc-500 text-sm">You haven't posted any trips yet.</p>
                        </div>
                    ) : (
                        myPostedTrips.map(trip => (
                            <div key={trip._id} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3.5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-base text-zinc-950 dark:text-white flex items-center gap-2">
                                            <span>{trip.source}</span>
                                            <ChevronRight size={15} className="text-zinc-400" />
                                            <span>{trip.destination}</span>
                                        </div>
                                        <div className="flex gap-3 text-xs text-zinc-500 mt-1 font-medium">
                                            <span className="flex items-center gap-1"><Calendar size={13} /> {trip.date}</span>
                                            <span className="flex items-center gap-1"><Clock size={13} /> {trip.time}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-base font-black text-blue-600 dark:text-blue-500">₹{trip.costPerPerson}</span>
                                        <span className="text-[11px] text-zinc-500 block">{trip.availableSeats} open</span>
                                    </div>
                                </div>

                                {/* Passenger Roster */}
                                <div className="bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-xl border border-zinc-200/70 dark:border-zinc-800">
                                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                                        Passengers ({trip.passengers?.length || 0})
                                    </span>
                                    {trip.passengers?.length > 0 ? (
                                        <ul className="space-y-1.5">
                                            {trip.passengers.map(p => {
                                                const pPhone = p.phone?.replace(/\s+/g, '') || '';
                                                const wa = `https://wa.me/${pPhone.startsWith('+') ? pPhone.slice(1) : pPhone}?text=Hi%20${encodeURIComponent(p.name)},%20about%20our%20ride...`;
                                                return (
                                                    <li key={p._id} className="flex justify-between items-center text-xs bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800">
                                                        <span className="font-semibold text-zinc-900 dark:text-white">{p.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-zinc-500">{p.phone}</span>
                                                            <a href={wa} target="_blank" rel="noopener noreferrer" className="p-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition">
                                                                <MessageCircle size={12} />
                                                            </a>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-zinc-400 italic">No passengers yet.</p>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-1">
                                    <button 
                                        onClick={() => setEditingTrip({...trip})} 
                                        className="flex-1 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                                    >
                                        <Edit2 size={13} /> Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(trip._id)} 
                                        className="flex-1 py-2 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border border-rose-200 dark:border-rose-900/30"
                                    >
                                        <Trash2 size={13} /> Cancel
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* TAB: JOINED TRIPS */}
            {activeTab === 'joined' && (
                <div className="space-y-3.5">
                    {myJoinedTrips.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                            <p className="text-zinc-500 text-sm">You haven't booked any rides yet.</p>
                        </div>
                    ) : (
                        myJoinedTrips.map(trip => {
                            const dPhone = trip.creator?.phone?.replace(/\s+/g, '') || '';
                            const wa = `https://wa.me/${dPhone.startsWith('+') ? dPhone.slice(1) : dPhone}?text=Hi%20${encodeURIComponent(trip.creator?.name || 'Driver')},%20I'm%20joining%20your%20ride!`;
                            return (
                                <div key={trip._id} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3.5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-base text-zinc-950 dark:text-white flex items-center gap-2">
                                                <span>{trip.source}</span>
                                                <ChevronRight size={15} className="text-zinc-400" />
                                                <span>{trip.destination}</span>
                                            </div>
                                            <div className="flex gap-3 text-xs text-zinc-500 mt-1 font-medium">
                                                <span className="flex items-center gap-1"><Calendar size={13} /> {trip.date}</span>
                                                <span className="flex items-center gap-1"><Clock size={13} /> {trip.time}</span>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-md text-xs font-bold border border-emerald-200 dark:border-emerald-800/40">
                                            Booked ✓
                                        </span>
                                    </div>

                                    {/* Driver Box with WhatsApp & Call */}
                                    <div className="bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-xl border border-zinc-200/70 dark:border-zinc-800 flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-zinc-400">Driver</p>
                                            <p className="text-xs font-bold text-zinc-900 dark:text-white">{trip.creator?.name}</p>
                                            <p className="text-xs font-mono text-zinc-500 mt-0.5">{trip.creator?.phone}</p>
                                        </div>

                                        {trip.creator?.phone && (
                                            <div className="flex items-center gap-2">
                                                <a href={`tel:${dPhone}`} className="px-2.5 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs font-bold flex items-center gap-1">
                                                    <Phone size={12} /> Call
                                                </a>
                                                <a href={wa} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs">
                                                    <MessageCircle size={12} /> WhatsApp
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <button 
                                        onClick={() => handleLeaveTrip(trip._id)} 
                                        className="w-full py-2 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 border border-rose-200 dark:border-rose-900/30"
                                    >
                                        <UserMinus size={13} /> Cancel Seat
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* EDIT TRIP MODAL */}
            {editingTrip && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={() => setEditingTrip(null)}>
                    <div 
                        className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-sm shadow-xl space-y-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-base text-zinc-900 dark:text-white">Edit Ride</h3>
                            <button onClick={() => setEditingTrip(null)} className="text-zinc-400 hover:text-zinc-600">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Date</label>
                                    <input type="date" required value={editingTrip.date} onChange={e => setEditingTrip({...editingTrip, date: e.target.value})} className={inputClass} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Time</label>
                                    <input type="time" required value={editingTrip.time} onChange={e => setEditingTrip({...editingTrip, time: e.target.value})} className={inputClass} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Open Seats</label>
                                    <input type="number" min="0" max="6" required value={editingTrip.availableSeats} onChange={e => setEditingTrip({...editingTrip, availableSeats: e.target.value})} className={inputClass} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Fare (₹)</label>
                                    <input type="number" min="0" required value={editingTrip.costPerPerson} onChange={e => setEditingTrip({...editingTrip, costPerPerson: e.target.value})} className={inputClass} />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition text-xs shadow-xs mt-2">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;