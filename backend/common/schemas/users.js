const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value)=>{
        return validator.isEmail(value);
      },
      message: 'The email provided is not valid',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        if (this.password === value) return true;
        return false;
      },
      message: 'The password and the confirm passowrd are not the same',
    },
  },
  roles: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roles',
    required: true,
  },
},
{strict: true});
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  this.password = crypto.createHash('sha256').update(this.password).digest('hex');
  this.confirmPassword = undefined;
  next();
});
const UserModel = mongoose.model('Users', userSchema);
module.exports = UserModel;
