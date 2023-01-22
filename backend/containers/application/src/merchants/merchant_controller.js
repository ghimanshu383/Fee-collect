const {AppError, CheckRequestValidation, MongoHelper} = require('../../lib');
const {MerchantMasterModel, FormOneTemplateModel} = require('../../lib/schemas');
const {ERRORS, getResponse, ERROR_MSG, FORMTYPES, PAYMENT_TEMPLATE_REF} = require('../../lib/constants');

/**
 *
 * @param {*} request express param
 * @param {*} response express param
 * @param {*} next express next function
 * @summary This api is to get the details of a single merchant the query param used is the merchant id which is index in the  merchant master schema
 */
exports.merchant = async (request, response, next) =>{
  try {
    const validationError = CheckRequestValidation(request);
    if (validationError) return next(new AppError(validationError, ERRORS.FAILED));
    const {merchantId} = request.query;
    const merchant = await MerchantMasterModel.findOne({merchantId});
    if (!merchant) return next(new AppError(ERROR_MSG.NOT_FOUND, ERRORS.NOT_FOUND));
    response.json(getResponse({merchant}));
  } catch (error) {
    next( new AppError(error.message, ERRORS.INTERNAL_SERVER));
  }
};
/**
 *
 * @param {*} request
 * @param {*} response is the list of all the merchants in the database
 * @param {*} next
 * @summary This api is used to get the merchant list from the database
 */
exports.merchants = async (request, response, next)=>{
  try {
    const queryInstance = new MongoHelper(MerchantMasterModel, request.query);
    const allMerchants = await queryInstance.find().sort().page().projection().query;
    const merchantCount = await queryInstance.find().count();
    response.json(getResponse({allMerchants, merchantCount}));
  } catch (error) {
    next(new AppError(error.message, ERRORS.INTERNAL_SERVER));
  }
};

/**
 *
 * @param {*} request
 * @param {*} response is the list of all the merchants in the database
 * @param {*} next
 * @summary This api is used to create new merchants
 */
exports.newMerchant = async (request, response, next) =>{
  try {
    const validationError = CheckRequestValidation(request);
    if (validationError) return next(new AppError(validationError, ERRORS.FAILED));
    const {name, logo, merchantId, address, email, phoneNumber} = request.body;
    const newMerchant = await MerchantMasterModel.create({name, logo, merchantId, address, email, phoneNumber});
    response.json(getResponse({newMerchant}).SUCCESS);
  } catch (error) {
    console.log(`Error [MerchantController][newMerchant] ${error.message}`);
    next(new AppError(error.message, ERRORS.INTERNAL_SERVER));
  }
};

/**
 *
 * @param {*} request
 * @param {*} response is the list of all the merchants in the database
 * @param {*} next
 * @summary This api used to create new payments for existing merchants ( for 4 types of different payments )
 */
exports.newPaymentType = async (request, response, next) =>{
  try {
    const validationError = CheckRequestValidation(request);
    if (validationError) return next(new AppError(validationError, ERRORS.FAILED));
    const {merchantId, paymentType} = request.body;
    const merchant = await MerchantMasterModel.findOne({merchantId});
    if (!merchant) return next(new AppError(ERROR_MSG.NOT_FOUND, ERRORS.NOT_FOUND));
    const existingPayment = merchant.paymentTypes.findIndex((payment) => payment.name === paymentType?.name);
    if (existingPayment >= 0) return next( new AppError('Payment name already exists', ERRORS.FAILED));
    // creating payment reference
    const updateResult = await updateMerchantwithPaymentTemplate(merchant, paymentType);
    if (!updateResult) return next(new AppError(ERROR_MSG.INTERNAL_SERVER, ERRORS.INTERNAL_SERVER));
    response.json(getResponse().SUCCESS);
  } catch (error) {
    console.log(`Error [MerchantController][newPaymentType] ${error.message}`);
    next(new AppError(error.message, ERRORS.INTERNAL_SERVER));
  }
};
const updateMerchantwithPaymentTemplate = async (merchant, paymentType) =>{
  try {
    let newpaymentObject = null;

    switch (paymentType.formType) {
    case FORMTYPES.FORM_ONE:
      const {userDetails, payContent, formType, name, idToDisplay} = paymentType;
      const formOneTemplateRef = await FormOneTemplateModel.create({merchantId: merchant.merchantId, userDetails, paymentName: name, payContent});
      newpaymentObject = {
        name,
        idToDisplay,
        formType,
        template_ref: formOneTemplateRef.id,
        template_ref_type: PAYMENT_TEMPLATE_REF.FORM_ONE,
      };
      break;
    case FORMTYPES.FORM_TWO:
      newpaymentObject = paymentType;
      break;
    case FORMTYPES.FORM_THREE:
      newpaymentObject = paymentType;
      break;
    }
    await merchant.updateOne({'$push': {'paymentTypes': newpaymentObject}});
    return true;
  } catch (error) {
    console.log('Error [Merchant Controller][updateMerchantWithPaymentTempalte]', error.message);
    return false;
  }
};
