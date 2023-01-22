const mongoose = require('mongoose');

const merchantMasterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A merchant must register with a name'],
  },
  logo: {
    type: String,
    default: null,
  },
  merchantId: {
    type: String,
    required: [true, 'Merchant id is required'],
  },
  address: {
    type: String,
    required: [true, 'merchant must be registered with an address'],
  },
  email: {
    type: String,
    required: [true, 'merchant must register with email address'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'merchant must register with phone number'],
  },
  paymentTypes: {
    type: [
      {
        _id: false,
        name: {
          type: 'String',
          required: true,
          index: true,
          unique: true,
        },
        template_ref: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'paymentTypes.template_ref_type',
          default: null,
          validate: {
            validator(value) {
              if (this.formType==='formOne') {
                if (!value) return false;
              }
              return true;
            },
            message: 'Template Ref is requried for this form Type',
          },
        },
        template_ref_type: {
          type: 'String',
          default: null,
          validate: {
            validator(value) {
              if (this.formType ==='formOne') {
                if (!value) return false;
                return true;
              }
              return true;
            },
            message: 'Template Ref is required for this form type',
          },
        },
        idToDisplay: {type: 'String', default: null},
        collectionName: {type: 'String', default: null},
        formType: {
          type: 'String',
          enum: ['formOne', 'formTwo', 'formThree', 'formFour'],
          required: true,
        },
        inputFields: {
          type: 'Map',
          of: {
            type: 'Boolean',
            default: false,
          },
          default: null,
        },
        selectionList: {
          type: [
            {
              _id: false,
              name: {
                type: 'String',
                required: true,
              },
              list: {
                type: ['string'],
                required: true,
              },
            },
          ],
          validate: {
            validator: function(selectionArray) {
              if (this.formType === 'formTwo') {
                if (selectionArray.length < 1) return false;
                return true;
              }
              return true;
            },
          },
          default: null,
        },
        startDate: {
          type: Date,
          default: Date.now(),
        },
        endDate: {
          type: Date,
          default: null,
        },
      },
    ],
  },
  paymentGateway: {
    type: String,
    enum: ['razorpay'],
    default: 'razorpay',
  },
});

merchantMasterSchema.index({merchantId: 1}, {unique: true});

const MerchantMaster = mongoose.model('MerchantMaster', merchantMasterSchema);
module.exports = MerchantMaster;
