const mongoose = require('mongoose');

const formOnePaymentStructureSchema = new mongoose.Schema({
  merchantId: {type: String, required: [true, 'Merchant name is required']},
  paymentName: {type: String, required: [true, 'Payment name is required']},
  userDetails: {type: [String], default: null},
  payContent: {
    type: [String],
    validate: {
      validator(feeConentArray) {
        if (feeConentArray.length < 1) return false;
        return true;
      },
      message: 'At least one type of fee content is required',
    },
  },
});

formOnePaymentStructureSchema.index({merchantId: 1, paymentName: 1}, {unique: true});
const formOneTemplate = mongoose.model('FormOneTemplate', formOnePaymentStructureSchema);

module.exports= formOneTemplate;
