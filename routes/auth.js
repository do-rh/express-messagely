"use strict";

const Router = require("express").Router;
const router = new Router();

const User = require('../models/user');
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../config');
const { UnauthorizedError } = require('../expressError');

/** POST /login: {username, password} => {token} */
router.post('/login', async function (req, res) {
    const userInfo = req.body;
    console.log('userInfo: ', userInfo);
    const user = await User.authenticate(userInfo);
    
    if (user) {
        User.updateLoginTimestamp(userInfo.username);
        const payload = { username: userInfo.username };
        const token = jwt.sign(payload, SECRET_KEY);
        return res.json({ token });
    }
    
    throw new UnauthorizedError('Invalid username/password');
});

/** POST /register: registers, logs in, and returns token.
 * 
 * {username, password, first_name, last_name, phone} => {token}.
 */

router.post('/register', function (req, res) {
    console.log('register route');
    const userInfo = req.body;
    const user = User.register(userInfo);

    if (user) {
        const payload = { username: userInfo.username };
        const token = jwt.sign(payload, SECRET_KEY);
        console.log('token', token);
        return res.json({ token });
    }
});

module.exports = router;