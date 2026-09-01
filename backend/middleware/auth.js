const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Get the token from the request header
        let token = req.header('Authorization');
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        // Handle both 'Bearer <token>' and raw '<token>' formats
        if (token.startsWith('Bearer ')) {
            token = token.slice(7);
        }

        // Verify the token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add the user info to the request so routes can access req.user.id
        req.user = { id: decoded.id };
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};