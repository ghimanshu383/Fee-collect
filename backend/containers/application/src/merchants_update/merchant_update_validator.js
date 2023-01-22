const {checkSchema} = require('express-validator');

exports.validateMerchant = checkSchema({
  merchantId: {
    in: ['query'],
    isString: {
      bail: true,
      errorMessage: 'Merchant id is required',
    },
  },
});

exports.validatePayments = checkSchema({
  merchantId: {
    in: ['query'],
    isString: {
      bail: true,
      errorMessage: 'Merchant Id is required',
    },
  },
});

exports.validateModifyPayment = checkSchema({
  'paymentName': {
    in: ['query'],
    isString: {
      bail: true,
      errorMessage: 'Payment Name is required',
    },
  },
  'merchantId': {
    isString: {
      bail: true,
      errorMessage: 'Merchant Id is required',
    },
  },
  'name': {
    isString: {
      bail: true,
      errorMessage: 'Payment name is required',
    },
  },
  'formType': {
    isString: {
      bail: true,
      errorMessage: 'Form Type is requried',
    },
    matches: {
      options: [/\b(?:formOne|formTwo|formThree|formFour)\b/],
      errorMessage: 'Invalid Form Type',
    },
  },
});

exports.valdiateDeletePayment = checkSchema({
  merchantId: {
    trim: true,
    in: ['query'],
    isString: {
      bail: true,
      errorMessage: 'Merchant Id is required',
    },
  },
  paymentName: {
    trim: true,
    in: ['query'],
    isString: {
      bail: true,
      errorMessage: 'Payment Name is required',
    },
  },
});
