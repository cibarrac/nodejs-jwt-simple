const express = require('express');

//Initializations
const app = express();

// ROUTES
const AuthController = require('./auth/AuthController')

app.use('/api/auth', AuthController);

module.exports = app;