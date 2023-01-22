const {USERS} = require('./constants');

const getDefaultRoles = ({create=false, read=false, update=false, remove=false}) =>{
  return {
    create,
    read,
    update,
    remove,
  };
};

exports.getDefaultRolesByUser = (user) =>{
  switch (user) {
  case USERS.SUPER_ADMIN:
    return {
      merchants: getDefaultRoles({create: true, read: true, update: true, remove: true}),
      payments: getDefaultRoles({create: true, read: true, update: true, remove: true}),
      employees: getDefaultRoles({create: false, read: false, update: false, remove: false}),
    };
    break;
  case USERS.ADMIN:
    return {
      merchants: getDefaultRoles({create: false, read: false, update: false, remove: false}),
      payments: getDefaultRoles({create: false, read: false, update: false, remove: false}),
      employees: getDefaultRoles({create: false, read: false, update: false, remove: false}),
    };
    break;
  case USERS.EMPLOYEE:
    return {
      merchants: getDefaultRoles({create: false, read: false, update: false, remove: false}),
      payments: getDefaultRoles({create: true, read: true, update: true, remove: true}),
      employees: getDefaultRoles({create: false, read: false, update: false, remove: false}),
    };
  }
};
