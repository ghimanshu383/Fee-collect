const {UserModel, RolesModel} = require('../../lib/schemas');

exports.createTestUser = async (userType) =>{
  try {
    const user = await UserModel.findOne({type: userType});
    if (!user) {
      console.log(`no test User found.. creating one for type ${userType}`);
      const roles = await RolesModel.findOne({type: userType});
      const testUser = await UserModel.create({
        roles: roles?._id,
        type: userType,
        email: `${userType}@feeCollect.in`,
        password: 'password',
        confirmPassword: 'password',
      });
      console.log('The test user was created successfully ', testUser);
    }
  } catch (error) {
    console.log('[test_user][createUser]', error.message);
  }
};
