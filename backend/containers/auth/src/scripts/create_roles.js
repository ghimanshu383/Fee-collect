const {getDefaultRolesByUser} = require('../../lib');
const {
  USERS,
} = require('../../lib/constants');
const {RolesModel} = require('../../lib/schemas');

exports.createRoles = async () =>{
  try {
    const allUsersTypes = Object.values(USERS);
    for (const type of allUsersTypes) {
      const role = await RolesModel.findOne({type});
      if (!role) {
        console.log(`No role type found for ${type}... creating role now`);
        await RolesModel.create({
          type,
          roles: getDefaultRolesByUser(type),
        });
      }
    }
  } catch (error) {
    console.log('[Auth scripts][createRoles]', error.message);
  }
};
