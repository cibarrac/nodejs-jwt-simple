const jwt = require('jsonwebtoken');
const config = require('../config');

async function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).json({
            auth: false,
            message: 'No Token Provided'
        });
    }
    try {
        const decoded = await jwt.verify(token, config.secret);
        console.log(decoded)
        req.userId = decoded.id;
        next();
    } catch (e) {
        return res.status(500).json({
            auth: false,
            message: 'Failed to authenticate token.'
        });
    }
};

module.exports = verifyToken;