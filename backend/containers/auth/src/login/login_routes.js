const express = require('express');

const {USERS} = require('../../lib/constants');
const {authorize} = require('../../lib/index');
const {loginController, logoutController} = require('./login_controller');
const {loginValidator} = require('./login_validators');
const Router = express.Router();

/**
 * @swagger
 * /api/v1/auth:
 *  get:
 *    description:This api is for login users in the application dashboard
 */
Router.post('/login', loginValidator, loginController);
Router.post('/logout', authorize(USERS.SUPER_ADMIN, USERS.ADMIN, USERS.EMPLOYEE), logoutController);

module.exports = Router;
