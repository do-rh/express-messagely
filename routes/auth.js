"use strict";

const Router = require("express").Router;
const router = new Router();

/** POST /login: {username, password} => {token} */


/** POST /register: registers, logs in, and returns token.
 * 
 * {username, password, first_name, last_name, phone} => {token}.
 */

//  if (User.usernameExists(username)) {
//     return ('Username already exists.')
//   }

module.exports = router;