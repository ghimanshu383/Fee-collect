const app = require('../../../common/config/app');
const {initiateServer} = require('../../../common/config/server');
const {USERS} = require('../lib/constants');
const {Login} = require('../src');
const {createRoles} = require('../src/scripts/create_roles');
const {createTestUser} = require('../src/scripts/test_user');

const routeObject = [
  {
    'prefix': '/api/v1/auth',
    'router': Login.Router,
  },
];
initiateServer({
  port: process.env.AUTH_SERVER_PORT,
  appInstance: app,
  routeObject,
});
createRoles();
createTestUser(USERS.SUPER_ADMIN);
