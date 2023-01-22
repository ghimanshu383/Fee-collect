const app = require('../../../common/config/app');
const {initiateServer} = require('../../../common/config/server');
const {Merchants, MerchantUpdates} = require('../src');

const routeObject = [
  {
    'prefix': '/api/v1/app',
    'router': Merchants.Router,
  },
  {
    'prefix': '/api/v1/app',
    'router': MerchantUpdates.Router,
  },

];

initiateServer({
  port: process.env.APP_SERVER_PORT,
  appInstance: app,
  routeObject,
});
