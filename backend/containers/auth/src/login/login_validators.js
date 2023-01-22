const {checkSchema} = require('express-validator');

exports.loginValidator = checkSchema({
  email: {
    isEmail: {
      bail: true,
      errorMessage: 'Not a valid email',
    },
  },
  password: {
    isLength: {
      options: {
        min: 6,
      },
      errorMessage: 'The passowrd is min 6 characters',
    },
  },
});
