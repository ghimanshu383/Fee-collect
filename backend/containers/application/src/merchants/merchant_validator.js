const {checkSchema} = require('express-validator');
const {ID_TO_DISPLAY_FORMS, FORMTYPES} = require('../../lib/constants');

exports.validateMerchant = checkSchema({
  merchantId: {
    in: ['query'],
    trim: true,
    isString: {
      bail: true,
      errorMessage: 'Merchant Id is required',
    },
  },
});
exports.validateNewMerchant = checkSchema({
  name: {
    isString: {
      bail: true,
      errorMessage: 'Name is required',
    },
  },
  merchantId: {
    isString: {
      bail: true,
      errorMessage: 'Merchant Id is requried',
    },
  },
  address: {
    isString: {
      bail: true,
      errorMessage: 'Address is required',
    },
  },
  logo: {
    isString: {
      bail: true,
      errorMessage: 'Logo is required',
    },
  },
  email: {
    isEmail: {
      bail: true,
      errorMessage: 'Email is not valid',
    },
  },
  phoneNumber: {
    isString: {
      bail: true,
      errorMessage: 'Phone number is required',
    },
  },
});
exports.validateNewPaymentType = checkSchema({
  'merchantId': {
    isString: {
      bail: true,
      errorMessage: 'Merchant Id is required',
    },
  },
  'paymentType': {
    isObject: {
      bail: true,
      errorMessage: 'Invalid paymentType',
    },
  },
  'paymentType.name': {
    isString: {
      bail: true,
      errorMessage: 'Valid name is requried',
    },
  },
  'paymentType.formType': {
    isString: {
      bail: true,
      errorMessage: 'Valid form Type is required',
    },
    matches: {
      options: [/\b(?:formOne|formTwo|formThree|formFour)\b/],
      errorMessage: 'Invalid form type',
    },
  },
  'paymentType.payContent': {
    custom: {
      options: (value, {req}) =>{
        if (req.body.paymentType.formType===FORMTYPES.FORM_ONE) {
          if (!Array.isArray(value) || value.length<1) {
            throw new Error('PayContent is required ');
          }
        }
        return true;
      },
    },
  },
  'paymentType.collectionName': {
    trim: true,
    custom: {
      options: (value, {req})=>{
        if (req.body.paymentType.formType === FORMTYPES.FORM_THREE) {
          if (!value) throw new Error('Payment Collection name is required for this form Type');
          return true;
        }
        return true;
      },
    },
  },

  'paymentType.idToDisplay': {
    trim: true,
    custom: {
      options: (value, {req})=>{
        if (ID_TO_DISPLAY_FORMS.includes(req.body.paymentType.formType)) {
          if (!value) throw new Error('Id to display is requried');
          return true;
        }
        return true;
      },
    },
  },
});
