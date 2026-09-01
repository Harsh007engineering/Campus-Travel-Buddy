require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Allow all origins

// Serverless-friendly MongoDB connection
let cachedConnection = null;

async function connectDB() {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error('MONGO_URI environment variable is not defined in Vercel settings.');
    }

    cachedConnection = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
    });
    return cachedConnection;
}

// Health & Diagnostic Endpoint
app.get('/api/health', async (req, res) => {
    let dbStatus = 'disconnected';
    let dbError = null;

    try {
        if (!process.env.MONGO_URI) {
            dbStatus = 'MONGO_URI_NOT_CONFIGURED';
        } else {
            await connectDB();
            dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'connecting';
        }
    } catch (err) {
        dbStatus = 'connection_failed';
        dbError = err.message;
    }

    res.json({
        status: 'ok',
        database: dbStatus,
        mongoUriConfigured: Boolean(process.env.MONGO_URI),
        jwtSecretConfigured: Boolean(process.env.JWT_SECRET),
        error: dbError,
        environment: process.env.NODE_ENV || 'production',
        timestamp: new Date().toISOString()
    });
});

// Middleware to ensure DB connection before executing API routes
app.use(async (req, res, next) => {
    if (req.path === '/' || req.path === '/api/health') {
        return next();
    }

    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('Database connection error:', err.message);
        return res.status(500).json({
            message: 'Database connection failed. Please ensure MONGO_URI is configured correctly in Vercel.',
            error: err.message,
            mongoUriConfigured: Boolean(process.env.MONGO_URI)
        });
    }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));

app.get('/', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Campus Travel Buddy API is running!',
        health: '/api/health'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({ 
        message: 'Internal server error',
        error: err.message 
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Required for Vercel serverless deployment
module.exports = app;