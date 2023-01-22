const express = require('express');
const proxy = require('express-http-proxy');
const dotenv = require('dotenv');
const url = require('url');
const cors = require('cors');

const proxyServer= express();
dotenv.config({path: `${__dirname}/../../config.env`});
exports.startProxyServer = ()=>{
  if (process.env.ENVIRONMENT==='development') {
    proxyServer.use(cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }));
    proxyServer.use('/api/v1/auth/*', proxy('http://localhost:3044', {proxyReqPathResolver: (request)=> url.parse(request.originalUrl).path}));
    proxyServer.use('/api/v1/app/*', proxy('http://localhost:3045', {proxyReqPathResolver: (request)=>url.parse(request.originalUrl).path}));
    proxyServer.listen(8000, ()=>{
      console.log('The proxy server started on port no 8000');
    });
  }
};
