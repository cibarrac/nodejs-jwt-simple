const { Router, json, urlencoded } = require('express');
const router = Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

// Models
const User = require('../user/User');

const verifyToken = require('./verifyToken');

// Middlewares
router.use(urlencoded({ extended: false }));
router.use(json());

// Auth Routes
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 8);
        // Create and Save a new User
        const createdUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        // Create a Token
        const token = jwt.sign({ id: createdUser._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        // Send Response to the client
        res.status(200).send({ auth: true, token });
    } catch (e) {
        return res.status(500).send('There was a problem registering the user');
    }
});

// Get the User id based on the Token
router.get('/me', verifyToken, async (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided' });
    try {
        // Decode the token to see the original payload
        // const decoded = await jwt.verify(token, config.secret);
        // You can send the decoded user ID
        // res.status(200).send(decoded);

        // or, send the User info
        // const user = await User.findById(decoded.id, { password: 0 });
        const user = await User.findById(req.userId, { password: 0});
        if (!user) return res.status(404).send('User Not Found');
        res.status(200).send(user);

    } catch (e) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send('User not found');

        const validPassword = bcrypt.compareSync(req.body.password, user.password);
        if (!validPassword) return res.status(401).json({ auth: false, token: null });
        const token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400
        });
        res.status(200).send({ auth: true, token });
    } catch (err) {
        return res.status(500).send('Internal Server Error');
    }
});

// This route is not necessary, the client side just can delete the token
// stored in a cookie or localstorage
router.get('/logout', (req, res) => {
    res.status(200).send({ auth: false, token: null });
});

module.exports = router;