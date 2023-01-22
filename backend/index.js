const {spawn} = require('child_process');
const {constants} = require('./common/lib/index');
const {startProxyServer} = require('./common/lib/proxy_server');

const allContainers = constants.CONTAINERS;
for (const container of allContainers) {
  const ls = spawn('node', ['--experimental-top-level-await', `./containers/${container}/config/server.js`]);
  ls.stdout.on('data', (data)=>{
    console.log(`[${container}]: ${data}`);
  });
  ls.stderr.on('data', (data)=>{
    console.log(`[error]: ${data}`);
  });
  ls.on('error', (error)=>{
    console.log('Container Error [error] ', error.message);
  });
}
startProxyServer();
