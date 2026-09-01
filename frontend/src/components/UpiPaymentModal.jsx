import React, { useState } from 'react';
import { X, IndianRupee, Copy, Check, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const UpiPaymentModal = ({ isOpen, onClose, trip }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen || !trip) return null;

    const rawPhone = trip.creator?.phone?.replace(/\D/g, '') || '';
    // Form a fallback UPI ID using mobile number (commonly number@ybl, number@paytm, or number@apl)
    const primaryPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : rawPhone;
    const upiId = primaryPhone ? `${primaryPhone}@upi` : '';
    const amount = trip.costPerPerson || 0;
    const hostName = trip.creator?.name || 'Ride Host';

    const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(hostName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`CampusBuddy-${trip.destination}`)}`;

    const handleCopy = () => {
        if (!primaryPhone) return;
        navigator.clipboard.writeText(primaryPhone);
        setCopied(true);
        toast.success(`Host's phone number (${primaryPhone}) copied!`);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="glass-panel p-6 sm:p-7 rounded-3xl w-full max-w-sm shadow-2xl space-y-5"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center pb-3 border-b border-zinc-200/60 dark:border-zinc-800/80">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl">
                            <IndianRupee size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-zinc-950 dark:text-white">Pay Ride Share</h3>
                            <p className="text-xs text-zinc-500">Direct peer UPI transfer (0% fee)</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Amount & Host Card */}
                <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-950/80 border border-zinc-200/80 dark:border-zinc-800 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Agreed Share</span>
                    <div className="text-3xl font-black text-zinc-900 dark:text-white flex items-center justify-center">
                        <IndianRupee size={24} strokeWidth={2.5} /> {amount}
                    </div>
                    <p className="text-xs text-zinc-500 font-medium pt-1">
                        Payable to <strong className="text-zinc-900 dark:text-white">{hostName}</strong>
                    </p>
                </div>

                {/* Host Phone & Copy Button */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                        Host UPI Phone Number
                    </label>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl border bg-white/70 dark:bg-zinc-950/70 border-zinc-200/80 dark:border-zinc-800">
                        <span className="font-mono font-bold text-sm text-zinc-900 dark:text-white flex-1 pl-1">
                            {trip.creator?.phone || 'Private until confirmed'}
                        </span>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="px-3 py-1.5 glass-panel text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-bold transition flex items-center gap-1 hover:text-blue-600"
                        >
                            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                </div>

                {/* UPI Deep-Link Pay Button */}
                <div className="space-y-2 pt-1">
                    <a
                        href={upiDeepLink}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-emerald-600/25 flex items-center justify-center gap-1.5"
                    >
                        Launch UPI App (GPay / PhonePe / Paytm) <ExternalLink size={13} />
                    </a>
                    <p className="text-[10px] text-zinc-400 text-center flex items-center justify-center gap-1">
                        <ShieldCheck size={11} className="text-emerald-600" /> Direct student-to-student payment. No app commission.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UpiPaymentModal;
