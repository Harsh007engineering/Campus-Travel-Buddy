import React, { useState } from 'react';
import { X, ShieldAlert, Phone, Copy, Check, MessageCircle, AlertTriangle, LifeBuoy } from 'lucide-react';
import toast from 'react-hot-toast';

const EMERGENCY_CONTACTS = [
    { title: 'VIT-AP Main Security Gate', number: '+91 86323 99999', desc: 'Campus Main Entrance Security 24/7' },
    { title: 'Campus Health Center / Ambulance', number: '+91 86323 99998', desc: 'Emergency medical response & ambulance' },
    { title: 'Andhra Pradesh Police (Emergency)', number: '112', desc: 'National unified emergency helpline' },
    { title: 'Disha Women Helpline (AP)', number: '1091', desc: 'Dedicated women safety fast-response helpline' },
];

const SafetyToolkitModal = ({ isOpen, onClose, activeTrip = null }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const generateSafetyMessage = () => {
        if (activeTrip) {
            return `Safety Alert: I am traveling from ${activeTrip.source} to ${activeTrip.destination} via Campus Travel Buddy.\nHost/Driver: ${activeTrip.creator?.name || 'Classmate'} (${activeTrip.creator?.phone || 'Private'})\nDate & Time: ${activeTrip.date} at ${activeTrip.time}\nVehicle: ${activeTrip.vehicleType || 'Car'}\nShared for safety check-in!`;
        }
        return `Safety Notice: I am traveling outside VIT-AP campus. Sharing my live location and contact details for safety check-in.`;
    };

    const handleCopySafetyMessage = () => {
        const text = generateSafetyMessage();
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Trip safety details copied to clipboard!');
        setTimeout(() => setCopied(false), 3000);
    };

    const handleWhatsAppShare = () => {
        const text = encodeURIComponent(generateSafetyMessage());
        window.open(`https://wa.me/?text=${text}`, '_blank');
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
                        <div className="p-2 bg-rose-50 dark:bg-rose-950/50 text-rose-600 rounded-xl">
                            <ShieldAlert size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-zinc-950 dark:text-white">Campus Safety & SOS Toolkit</h3>
                            <p className="text-xs text-zinc-500">Official university emergency contacts & instant check-in</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Instant Share with Roommate or Parents */}
                <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-950/80 border border-zinc-200/80 dark:border-zinc-800 space-y-2.5">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                            <LifeBuoy size={14} className="text-blue-600" /> Share Trip with Roommate or Parents
                        </span>
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                            Peace of Mind
                        </span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        Send a pre-formatted WhatsApp message with your vehicle, driver name, route, and departure time before stepping outside campus.
                    </p>
                    <div className="flex gap-2 pt-1">
                        <button
                            type="button"
                            onClick={handleWhatsAppShare}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                        >
                            <MessageCircle size={14} /> Send via WhatsApp
                        </button>
                        <button
                            type="button"
                            onClick={handleCopySafetyMessage}
                            className="px-3.5 py-2 glass-panel text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                            {copied ? 'Copied' : 'Copy Text'}
                        </button>
                    </div>
                </div>

                {/* Emergency Helplines List */}
                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                        Direct Emergency Helplines (24/7)
                    </label>
                    <div className="space-y-2">
                        {EMERGENCY_CONTACTS.map((c, i) => (
                            <div 
                                key={i} 
                                className="flex justify-between items-center p-3 rounded-2xl bg-white/70 dark:bg-zinc-950/70 border border-zinc-200/70 dark:border-zinc-800"
                            >
                                <div>
                                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{c.title}</h4>
                                    <p className="text-[10px] text-zinc-400">{c.desc}</p>
                                </div>
                                <a 
                                    href={`tel:${c.number.replace(/\s+/g, '')}`}
                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition border border-rose-200/80 dark:border-rose-900/40"
                                >
                                    <Phone size={12} /> {c.number}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Safety Advisory Banner */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-800 dark:text-amber-300">
                    <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                    <span>Always verify your driver's college ID card at the campus security gate before departure.</span>
                </div>
            </div>
        </div>
    );
};

export default SafetyToolkitModal;
