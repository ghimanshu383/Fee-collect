const jwt = require('jsonwebtoken');
const AppError = require('./appError');
const redisClient = require('./redisClient');
const {ERRORS, ERROR_MSG, REDISFORMAT} = require('./constants');

exports.jwtSign = (userDetails) =>{
  return jwt.sign({userDetails}, process.env.SECRET, {expiresIn: process.env.EXPIRY});
};

exports.authorize = (...roles) =>{
  return async (request, response, next) =>{
    try {
      const token = request.headers.authorization?.split(' ')[1];
      const userDetails = jwt.verify(token, process.env.SECRET, (error, payload)=>{
        if (error) throw new Error('Token expired..Login Again');
        return payload?.userDetails;
      });
      if (userDetails) {
        const validToken = await checkTokenExpiryWithRedis(token, userDetails._id);

        if (roles.includes(userDetails?.type) && validToken) {
          request.user = userDetails;
          return next();
        }
        return next(new AppError(ERROR_MSG.UNAUTHORIZED, ERRORS.UNAUTHORIZED ));
      }
      next(new AppError(ERROR_MSG.INTERNAL_SERVER, ERRORS.INTERNAL_SERVER));
    } catch (error) {
      next(new AppError(error.message, ERRORS.INTERNAL_SERVER));
    }
  };
};
const checkTokenExpiryWithRedis = async (token, userId) =>{
  const tokenInRedis = await redisClient.get(REDISFORMAT.tokenFormat(userId));
  if (tokenInRedis?.toString() === token.toString()) return true;
  return false;
};
