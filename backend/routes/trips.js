const express = require('express');
const Trip = require('../models/Trip');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new trip (protected)
router.post('/create', auth, async (req, res) => {
    try {
        const newTrip = new Trip({ ...req.body, creator: req.user.id });
        await newTrip.save();
        
        const populatedTrip = await Trip.findById(newTrip._id)
            .populate('creator', 'name email phone');
        res.status(201).json(populatedTrip);
    } catch (err) {
        console.error('Create trip error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get all trips (public)
router.get('/all', async (req, res) => {
    try {
        const trips = await Trip.find()
            .populate('creator', 'name email phone')
            .populate('passengers', 'name email phone')
            .sort({ createdAt: -1 });
        res.status(200).json(trips);
    } catch (err) {
        console.error('Get trips error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Join a trip (protected)
router.post('/join/:id', auth, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        if (trip.availableSeats <= 0) return res.status(400).json({ message: 'Trip is full!' });
        if (trip.creator.toString() === req.user.id) return res.status(400).json({ message: 'You cannot join your own trip!' });
        if (trip.passengers.includes(req.user.id)) return res.status(400).json({ message: 'You already joined this trip!' });

        trip.passengers.push(req.user.id);
        trip.availableSeats -= 1;
        await trip.save();
        
        const updatedTrip = await Trip.findById(trip._id)
            .populate('creator', 'name email phone')
            .populate('passengers', 'name email phone');
        res.status(200).json({ message: 'Successfully joined the trip!', trip: updatedTrip });
    } catch (err) {
        console.error('Join trip error:', err);
        res.status(500).json({ message: 'Server error while joining trip' });
    }
});

// Leave a trip (protected)
router.post('/leave/:id', auth, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        if (!trip.passengers.includes(req.user.id)) {
            return res.status(400).json({ message: 'You are not a passenger on this trip!' });
        }

        trip.passengers = trip.passengers.filter(id => id.toString() !== req.user.id);
        trip.availableSeats += 1;
        await trip.save();
        
        res.status(200).json({ message: 'You have left the trip.' });
    } catch (err) {
        console.error('Leave trip error:', err);
        res.status(500).json({ message: 'Server error while leaving trip' });
    }
});

// Edit a trip (protected, creator only)
router.put('/edit/:id', auth, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        if (trip.creator.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized to edit this trip' });

        const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('creator', 'name email phone')
            .populate('passengers', 'name email phone');
        res.status(200).json(updatedTrip);
    } catch (err) {
        console.error('Edit trip error:', err);
        res.status(500).json({ message: 'Server error while editing' });
    }
});

// Delete a trip (protected, creator only)
router.delete('/delete/:id', auth, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        if (trip.creator.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized to delete this trip' });

        await trip.deleteOne();
        res.status(200).json({ message: 'Trip deleted successfully' });
    } catch (err) {
        console.error('Delete trip error:', err);
        res.status(500).json({ message: 'Server error while deleting' });
    }
});

module.exports = router;