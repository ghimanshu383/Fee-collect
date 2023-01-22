const express = require('express');

const {USERS} = require('../../lib/constants');
const {authorize, uploadImageMiddleWare, resizeImageMiddleware} = require('../../lib/index');
const {validateNewMerchant, validateNewPaymentType} = require('./merchant_validator');
const {newMerchant, newPaymentType, merchants, merchant} = require('./merchant_controller');
const Router = express.Router();

Router.get('/merchant',
  authorize(USERS.SUPER_ADMIN),
  merchant);

Router.get('/merchants',
  authorize(USERS.SUPER_ADMIN),
  merchants );

Router.post('/newMerchant',
  authorize(USERS.SUPER_ADMIN),
  uploadImageMiddleWare('logo'),
  resizeImageMiddleware('logo'),
  validateNewMerchant, newMerchant);

Router.post('/newPaymentType',
  authorize(USERS.SUPER_ADMIN),
  validateNewPaymentType,
  newPaymentType);

module.exports = Router;
