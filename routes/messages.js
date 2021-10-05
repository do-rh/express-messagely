"use strict";

const Router = require("express").Router;
const router = new Router();
const Message = require('../models/message');
const User = require('../models/user');
const { UnauthorizedError, NotFoundError } = require('../expressError');

app.use(authenticateJWT);


/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Makes sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get('/:id', ensureLoggedIn, async function (req, res) {
    //get the to_user or from_user from Message.get()
    //check if username in the token is either
    //then, return message details
    message = await Message.get(req.params.id);
    if (res.locals.user.username === message.from_user.username ||
        res.locals.user.username === message.to_user.username) {
        return message;
    }

    throw new UnauthorizedError('unauthorized user to view this message!');

})


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

 router.post('/', ensureLoggedIn, async function (req, res) {
    let newMessage = req.body;
    newMessage["from_username"] = res.locals.user.username;
    //check to_user is valid, but allowing to send to self.
    if (User.usernameExists(newMessage.to_username)) {
        newMessage = await Message.create(newMessage)
    }

    throw new NotFoundError(`To_user ${newMessage.to_username} not found!`);

})

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Makes sure that the only the intended recipient can mark as read.
 *
 **/

 router.post('/:id/read', ensureLoggedIn, async function (req, res) {
    const messageId = req.params.id;
    const message = Message.get(messageId);
    if (res.locals.user.username === message.to_username) {
        return Message.markRead(messageId);
    }

    throw new UnauthorizedError('Wrong user');
})

module.exports = router;