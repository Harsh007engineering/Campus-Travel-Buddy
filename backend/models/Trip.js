const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    source: { type: String, required: true },
    destination: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    availableSeats: { type: Number, required: true },
    costPerPerson: { type: Number, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // Rich Campus Travel Metadata
    vehicleType: { type: String, default: 'Car' }, // 'Car' | 'Auto' | 'Cab' | 'Bike'
    luggage: { type: String, default: 'Standard' }, // 'Backpack' | 'Suitcase' | 'Any'
    preferences: [{ type: String }], // 'AC', 'Music', 'Girls-Only', 'Quiet'
    pickupLandmark: { type: String, default: '' }, // e.g. 'Main Gate', 'Clock Tower', 'Hostel Block 1'
    notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Trip', TripSchema);