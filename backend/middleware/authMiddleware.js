const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Check if token exists in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // 2. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Attach user to request object
        req.user = await User.findById(decoded.id).select('-password');

        next(); //  Move to the next function

    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = protect;