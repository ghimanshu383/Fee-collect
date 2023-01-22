const crypto = require('crypto');
const {validationResult} = require('express-validator');

exports.getHashedPassword = (password) =>{
  const hash = crypto.createHash('sha256').update(password);
  return hash.digest('hex');
};
const generateValidationErrorResponse = (errors = [])=>{
  let errorString = '';
  for (const error of errors) {
    errorString = errorString.concat(' ', error.msg);
  }
  return errorString;
};
exports.CheckRequestValidation = (request)=>{
  const Errors = validationResult(request);
  if (!Errors.isEmpty()) {
    const errorString = generateValidationErrorResponse(Errors.array());
    return errorString;
  }
  return false;
};
