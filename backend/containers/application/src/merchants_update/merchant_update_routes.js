const express = require('express');
const router = express.Router();

const {USERS} = require('../../lib/constants');
const {authorize, uploadImageMiddleWare, resizeImageMiddleware} = require('../../lib/index');
const {updateMerchantDetails, payments, deletePayment, modifyPayment} = require('./merchant_update_controller');
const {validateMerchant, validatePayments, validateModifyPayment} = require('./merchant_update_validator');

router.get('/payments',
  authorize(USERS.SUPER_ADMIN),
  validatePayments,
  payments);

router.post('/merchant',
  authorize(USERS.SUPER_ADMIN),
  uploadImageMiddleWare('logo'),
  resizeImageMiddleware('logo'),
  validateMerchant,
  updateMerchantDetails);

router.post('/payment',
  authorize(USERS.SUPER_ADMIN),
  validateModifyPayment,
  modifyPayment,
);

router.delete('/payment',
  authorize(USERS.SUPER_ADMIN),
  deletePayment,
);
module.exports = router;
