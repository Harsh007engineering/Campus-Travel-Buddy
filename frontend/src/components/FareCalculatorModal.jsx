import React, { useState } from 'react';
import { X, Calculator, IndianRupee, Users, Sparkles, ArrowRight, Check } from 'lucide-react';

const COMMON_ROUTES = [
    { name: 'Vijayawada Railway Station (Cab)', baseFare: 600, defaultSeats: 4, from: 'VIT-AP Main Gate', to: 'Vijayawada Railway Stn' },
    { name: 'Vijayawada Railway Station (Auto)', baseFare: 320, defaultSeats: 3, from: 'VIT-AP Main Gate', to: 'Vijayawada Railway Stn' },
    { name: 'Guntur Bus Stand (Auto)', baseFare: 240, defaultSeats: 3, from: 'VIT-AP Campus', to: 'Guntur Bus Stand' },
    { name: 'Hyderabad Airport (Innova/Cab)', baseFare: 3200, defaultSeats: 5, from: 'VIT-AP Campus', to: 'Rajiv Gandhi Intl Airport (HYD)' },
    { name: 'PVP Square Mall (Cab)', baseFare: 400, defaultSeats: 4, from: 'VIT-AP Main Gate', to: 'PVP Square Mall' },
];

const FareCalculatorModal = ({ isOpen, onClose, onApplyToForm }) => {
    const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
    const [totalFare, setTotalFare] = useState(COMMON_ROUTES[0].baseFare);
    const [passengerCount, setPassengerCount] = useState(4);

    if (!isOpen) return null;

    const handleRouteChange = (idx) => {
        setSelectedRouteIdx(idx);
        if (idx !== -1) {
            setTotalFare(COMMON_ROUTES[idx].baseFare);
            setPassengerCount(COMMON_ROUTES[idx].defaultSeats);
        }
    };

    const costPerPerson = passengerCount > 0 ? Math.round(totalFare / passengerCount) : totalFare;
    const soloCost = totalFare;
    const savedPerPerson = soloCost - costPerPerson;
    const totalGroupSavings = savedPerPerson * passengerCount;

    const handleApply = () => {
        const route = selectedRouteIdx !== -1 ? COMMON_ROUTES[selectedRouteIdx] : null;
        onApplyToForm({
            source: route ? route.from : 'VIT-AP Main Gate',
            destination: route ? route.to : '',
            costPerPerson: costPerPerson,
            availableSeats: Math.max(1, passengerCount - 1),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="glass-panel p-6 sm:p-7 rounded-3xl w-full max-w-lg shadow-2xl space-y-6"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center pb-3 border-b border-zinc-200/60 dark:border-zinc-800/80">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-xl">
                            <Calculator size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-zinc-950 dark:text-white">Campus Fare Split & Savings</h3>
                            <p className="text-xs text-zinc-500">Calculate split cost per head before booking an auto or cab</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Route Selector */}
                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                        Select Campus Commute Route
                    </label>
                    <select 
                        value={selectedRouteIdx} 
                        onChange={(e) => handleRouteChange(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-white/70 dark:bg-zinc-950/70 border-zinc-200/80 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                        {COMMON_ROUTES.map((route, i) => (
                            <option key={i} value={i} className="dark:bg-zinc-900 text-zinc-900 dark:text-white">
                                {route.name} — ~₹{route.baseFare} Total
                            </option>
                        ))}
                    </select>
                </div>

                {/* Inputs: Total Fare & Passenger Count */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                            Total Vehicle Fare (₹)
                        </label>
                        <input 
                            type="number" 
                            min="10" 
                            value={totalFare} 
                            onChange={(e) => {
                                setTotalFare(Number(e.target.value));
                                setSelectedRouteIdx(-1);
                            }} 
                            className="w-full px-3.5 py-2.5 rounded-xl border bg-white/70 dark:bg-zinc-950/70 border-zinc-200/80 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <div>
                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                            Students Sharing
                        </label>
                        <div className="flex items-center gap-1.5">
                            {[2, 3, 4, 5].map(num => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setPassengerCount(num)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                                        passengerCount === num 
                                            ? 'bg-blue-600 text-white shadow-xs' 
                                            : 'glass-panel text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                                    }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Calculation Summary Card */}
                <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-zinc-950/80 border border-blue-200/80 dark:border-blue-900/40 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Each Student Pays:</span>
                        <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                            ₹{costPerPerson}
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2 border-t border-blue-200/50 dark:border-zinc-800">
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <Sparkles size={13} /> You Save vs Solo:
                        </span>
                        <span className="font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
                            ₹{savedPerPerson} saved per person!
                        </span>
                    </div>
                </div>

                {/* Apply Button */}
                <div className="flex gap-2.5 pt-1">
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="flex-1 py-2.5 glass-panel text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-xs transition"
                    >
                        Close
                    </button>
                    <button 
                        type="button"
                        onClick={handleApply} 
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-blue-600/25 flex items-center justify-center gap-1.5"
                    >
                        Apply to Offer Form <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FareCalculatorModal;
