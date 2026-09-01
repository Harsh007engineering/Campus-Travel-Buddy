// Demo dataset for Guest Mode
// Allows external visitors, recruiters, and reviewers to experience all app features
// without accessing or modifying any real student data.

const INITIAL_DEMO_TRIPS = [
    {
        _id: 'demo_1',
        source: 'VIT-AP Campus (Gate 1)',
        destination: 'Vijayawada Railway Station',
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days ahead
        time: '17:30',
        availableSeats: 2,
        costPerPerson: 120,
        creator: {
            _id: 'driver_1',
            name: 'Rahul Verma (Demo Host)',
            phone: '+91 98765 11001',
            email: 'rahul.demo@vitapstudent.ac.in'
        },
        passengers: [
            {
                _id: 'pass_1',
                name: 'Sneha Reddy',
                phone: '+91 98765 11002'
            }
        ]
    },
    {
        _id: 'demo_2',
        source: 'VIT-AP Campus (Hostel Block)',
        destination: 'Guntur Bus Stand',
        date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 days ahead
        time: '09:00',
        availableSeats: 3,
        costPerPerson: 80,
        creator: {
            _id: 'driver_2',
            name: 'Ananya Gupta (Demo Host)',
            phone: '+91 98765 11003',
            email: 'ananya.demo@vitapstudent.ac.in'
        },
        passengers: []
    },
    {
        _id: 'demo_3',
        source: 'VIT-AP Campus',
        destination: 'Rajiv Gandhi Intl Airport (HYD)',
        date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // 5 days ahead
        time: '05:30',
        availableSeats: 1,
        costPerPerson: 650,
        creator: {
            _id: 'driver_3',
            name: 'Karthik Rao (Demo Host)',
            phone: '+91 98765 11004',
            email: 'karthik.demo@vitapstudent.ac.in'
        },
        passengers: [
            {
                _id: 'pass_2',
                name: 'Vikram Singh',
                phone: '+91 98765 11005'
            },
            {
                _id: 'pass_3',
                name: 'Pooja Nair',
                phone: '+91 98765 11006'
            }
        ]
    },
    {
        _id: 'demo_4',
        source: 'PVP Square Mall (Vijayawada)',
        destination: 'VIT-AP Campus',
        date: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0], // Tomorrow
        time: '20:15',
        availableSeats: 4,
        costPerPerson: 100,
        creator: {
            _id: 'driver_4',
            name: 'Siddharth Roy (Demo Host)',
            phone: '+91 98765 11007',
            email: 'siddharth.demo@vitapstudent.ac.in'
        },
        passengers: []
    }
];

const GUEST_STORAGE_KEY = 'campus_buddy_guest_trips';

export const getGuestTrips = () => {
    try {
        const stored = sessionStorage.getItem(GUEST_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error reading guest trips:', e);
    }
    // Initialize with fresh clone of initial demo trips
    sessionStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_TRIPS));
    return INITIAL_DEMO_TRIPS;
};

export const saveGuestTrips = (trips) => {
    try {
        sessionStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(trips));
    } catch (e) {
        console.error('Error saving guest trips:', e);
    }
};

export const createGuestTrip = (tripData, currentUser) => {
    const trips = getGuestTrips();
    const newTrip = {
        _id: 'demo_user_trip_' + Date.now(),
        ...tripData,
        availableSeats: Number(tripData.availableSeats),
        costPerPerson: Number(tripData.costPerPerson),
        creator: {
            _id: currentUser.id,
            name: currentUser.name,
            phone: currentUser.phone || '+91 98765 43210',
            email: currentUser.email
        },
        passengers: []
    };
    const updated = [newTrip, ...trips];
    saveGuestTrips(updated);
    return newTrip;
};

export const joinGuestTrip = (tripId, currentUser) => {
    const trips = getGuestTrips();
    const trip = trips.find(t => t._id === tripId);
    if (!trip) throw new Error('Trip not found');
    if (trip.availableSeats <= 0) throw new Error('Trip is full!');
    if (trip.creator._id === currentUser.id) throw new Error('You cannot join your own trip!');
    if (trip.passengers.some(p => p._id === currentUser.id)) throw new Error('You already joined this trip!');

    trip.passengers.push({
        _id: currentUser.id,
        name: currentUser.name,
        phone: currentUser.phone || '+91 98765 43210'
    });
    trip.availableSeats -= 1;
    saveGuestTrips(trips);
    return trip;
};

export const leaveGuestTrip = (tripId, currentUser) => {
    const trips = getGuestTrips();
    const trip = trips.find(t => t._id === tripId);
    if (!trip) throw new Error('Trip not found');

    trip.passengers = trip.passengers.filter(p => p._id !== currentUser.id);
    trip.availableSeats += 1;
    saveGuestTrips(trips);
    return trip;
};

export const updateGuestTrip = (tripId, updateData) => {
    const trips = getGuestTrips();
    const index = trips.findIndex(t => t._id === tripId);
    if (index === -1) throw new Error('Trip not found');

    trips[index] = {
        ...trips[index],
        ...updateData,
        availableSeats: Number(updateData.availableSeats),
        costPerPerson: Number(updateData.costPerPerson)
    };
    saveGuestTrips(trips);
    return trips[index];
};

export const deleteGuestTrip = (tripId) => {
    const trips = getGuestTrips().filter(t => t._id !== tripId);
    saveGuestTrips(trips);
};

export const enterGuestMode = () => {
    const guestUser = {
        id: 'guest_demo_user_007',
        name: 'Guest Explorer',
        email: 'guest.preview@demo.campus',
        phone: '+91 98765 43210',
        isGuest: true
    };
    localStorage.setItem('token', 'guest_demo_session_token');
    localStorage.setItem('user', JSON.stringify(guestUser));
    // Reset guest trips session to fresh initial state
    sessionStorage.removeItem(GUEST_STORAGE_KEY);
    return guestUser;
};

export const isGuestUser = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        return Boolean(user?.isGuest);
    } catch {
        return false;
    }
};
