const multer = require('multer');
const sharp = require('sharp');
const Path = require('path');
const AppError = require('./appError');
const {ERRORS} = require('./constants');

const uploadImageMiddleWare = (fieldName)=>{
  return (request, response, next) =>{
    const multerStorage = multer.memoryStorage();
    const fileFilter = (request, file, callback) =>{
      if (file.mimetype.startsWith('image')) return callback(null, true);
      return callback(new Error('Upload Image only'), false);
    };
    const uploadImage = multer({
      storage: multerStorage,
      fileFilter: fileFilter,
      limits: {fileSize: 1048576}, // limit is 10MB
    });
    uploadImage.single(fieldName)(request, response, function(err) {
      if (err) {
        return next(new AppError(err.message, ERRORS.FAILED));
      }
      next();
    });
  };
};

const resizeImageMiddleware = (fieldName) => {
  return async (request, response, next) =>{
    try {
      if (!request.file) return next();
      const merchantId = request.body.merchantId || request.query.merchantId;
      const fileName = `${merchantId}-${fieldName}.jpeg`;
      request.body[fieldName] = fileName;
      const resizedBuffer = await sharp(request.file.buffer)
        .resize({width: 200, height: 200})
        .toFormat('jpeg').jpeg({quality: 80})
        .toBuffer();
      request.file.buffer = resizedBuffer;
      next();
    } catch (error) {
      return next(new AppError(error.message, ERRORS.INTERNAL_SERVER));
    }
  };
};

module.exports = {
  uploadImageMiddleWare,
  resizeImageMiddleware,
};
