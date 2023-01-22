const {jwtSign, AppError, getHashedPassword, CheckRequestValidation, redisClient} = require('../../lib/index');
const {UserModel} = require('../../lib/schemas');
const {getResponse, ERRORS, ERROR_MSG, REDISFORMAT} = require('../../lib/constants');

exports.loginController = async (request, response, next) =>{
  try {
    const validationError = CheckRequestValidation(request);
    if (validationError) return next(new AppError(validationError), ERRORS.FAILED);
    const {email, password} = request.body;
    const user = await UserModel.findOne({email, password: getHashedPassword(password)}).select({'__v': 0});
    if (!user) return next(new AppError(ERROR_MSG.NOT_FOUND, ERRORS.NOT_FOUND));
    const token = jwtSign(user);
    redisClient.set(REDISFORMAT.tokenFormat(user._id), token);
    response.json(getResponse({user, token}).SUCCESS);
  } catch (error) {
    next(new AppError(error.message, ERRORS.INTERNAL_SERVER));
  }
};
exports.logoutController = async (request, response, next) =>{
  try {
    const user = request.user;
    redisClient.del(REDISFORMAT.tokenFormat(user._id));
    response.json(getResponse({message: 'Logout successful'}).SUCCESS);
  } catch (error) {
    next(new AppError(error.message, ERRORS.INTERNAL_SERVER));
  }
};
