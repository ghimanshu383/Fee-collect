const mongoose = require('mongoose');

const defaultRoles = {
  create: {type: Boolean, default: false},
  read: {type: Boolean, default: false},
  update: {type: Boolean, default: false},
  remove: {type: Boolean, default: false},

};
const rolesSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  roles: {
    merchants: defaultRoles,
    payments: defaultRoles,
    employees: defaultRoles,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
}, {
  strict: true,
});

const RolesModel = mongoose.model('Roles', rolesSchema);

module.exports = RolesModel;
