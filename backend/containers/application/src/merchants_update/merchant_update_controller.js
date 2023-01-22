const {AppError, CheckRequestValidation, uploadImageToGcp} = require('../../lib');
const {ERRORS, ERROR_MSG, getResponse, FORMTYPES} = require('../../lib/constants');
const {MerchantMasterModel, FormOneTemplateModel} = require('../../lib/schemas');

/**
 *
 * @param {*} request express request param
 * @param {*} response express response param
 * @param {*} next express next param
 * @summary This Api endpoit is updating the personal detail of the merchant - The merchant Id is unique and fixed and cannot be updated while all other things can be updated
 */
exports.updateMerchantDetails = async (request, response, next) =>{
  try {
    const validationError = CheckRequestValidation(request);
    if (validationError) return next(new AppError(validationError, ERRORS.FAILED));
    if (request.body.merchantId) return next(new AppError('Merchant Id cannot be updated', ERRORS.FAILED));
    const {merchantId} = request.query;
    const merchant = MerchantMasterModel.findOne({merchantId});
    if (!merchant) return next(new AppError(ERROR_MSG.NOT_FOUND, ERRORS.NOT_FOUND));
    const {name, email, address, phoneNumber, logo} = request.body;
    await merchant.updateOne({$set: {email, name, address, phoneNumber}});
    // checking if image is to be updated
    if (request?.file?.buffer) {
      const uploadImage = await uploadImageToGcp(request, logo);
      if (!uploadImage) return next(new AppError('Image Can\'t be uploaded', 500));
    }
    response.json(getResponse());
  } catch (error) {
    console.log(error);
    return next(new AppError(ERROR_MSG.INTERNAL_SERVER, ERRORS.INTERNAL_SERVER));
  }
};

/**
 *
 * @param {*} request express request param
 * @param {*} response express response param
 * @param {*} next express next param
 * @summary This api is used to return all the payments types of a specific merchant, the merchant id is provided in the query parameter
 */
exports.payments = async (request, response, next) =>{
  try {
    const validationError = CheckRequestValidation(request);
    if (validationError) return next(new AppError(validationError));
    const {merchantId} = request.query;
    const merchant = await MerchantMasterModel.findOne({merchantId}).populate({path: 'paymentTypes.template_ref', select: '-__v'});
    if (!merchant) return next(new AppError(ERROR_MSG.NOT_FOUND, ERRORS.NOT_FOUND));
    response.json(getResponse({paymentTypes: merchant.paymentTypes}).SUCCESS);
  } catch (error) {
    console.log(error);
    return next(new AppError(ERROR_MSG.INTERNAL_SERVER, ERRORS.INTERNAL_SERVER));
  }
};

exports.modifyPayment = async (request, response, next) =>{
  try {
    const validationError = CheckRequestValidation(request);
    if (validationError) return next(new AppError(validationError, ERRORS.FAILED));
    const {merchantId, paymentName} = request.query;
    const {
      name,
      formType,
      idToDisplay,
      collectionName,
      inputFields,
      selectionList,
      templateRef,
      templateRefType} = request.body;
    const merchant = await MerchantMasterModel.findOne({merchantId});
    if (!merchant) return next(new AppError(ERROR_MSG.NOT_FOUND, ERRORS.NOT_FOUND));
    if (formType === FORMTYPES.FORM_ONE) {
      const template = await FormOneTemplateModel.findById(templateRef?.id);
      if (!template) return next(new AppError('No Template found ', ERRORS.FAILED));
      await template.updateOne({'$set': {...templateRef}}, {runValidators: true});
    }
    await MerchantMasterModel.findOneAndUpdate({
      merchantId, 'paymentTypes.name': paymentName, 'paymentTypes.formType': formType},
    {'$set': {'paymentTypes.$': {
      name,
      formType,
      idToDisplay,
      collectionName,
      inputFields,
      selectionList,
      template_ref:
      templateRef?.id,
      template_ref_type:
      templateRefType}}},
    {runValidators: true});

    response.json(getResponse({message: 'Payment Updated Successfully'}).SUCCESS);
  } catch (error) {
    console.log(error);
    return next(new AppError(error.message, ERRORS.INTERNAL_SERVER));
  }
};
exports.deletePayment = async (request, response, next) =>{
  try {
    const validationError = CheckRequestValidation(request);
    if (validationError) return next(new AppError(validationError, ERRORS.FAILED));
    const {merchantId, paymentName, formType} = request.query;
    const merchant = await MerchantMasterModel.findOne({merchantId});
    if (!merchant) return next(new AppError(ERROR_MSG.NOT_FOUND, ERRORS.NOT_FOUND));
    await merchant.updateOne({'$pull': {'paymentTypes': {'name': paymentName}}});
    if (formType === FORMTYPES.FORM_ONE) await FormOneTemplateModel.findOneAndDelete({merchantId, paymentName});
    const updatedPaymentTypes = merchant.paymentTypes.filter((payment)=> payment.name !== paymentName);
    response.json(getResponse({paymentTypes: updatedPaymentTypes}).SUCCESS);
  } catch (error) {
    console.log(error);
    return next(new AppError(ERROR_MSG.INTERNAL_SERVER, ERRORS.INTERNAL_SERVER));
  }
};
