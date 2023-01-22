const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const Path = require('path');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJSdocs= require('swagger-jsdoc');
const cookieParser = require('cookie-parser');

const AppError = require('../lib/appError');

const getSwaggerOption = (port)=> {
  return {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Fee-Collect',
        version: '1.0.0',
        description: 'Fee Collect dashboard api documentation',
      },
      servers: [
        {
          url: `http://localhost:${port}`,
        },
      ],
    },
    apis: [Path.join(`${__dirname}`, '../../containers/*/src/*/*.js')],
  };
};
exports.initiateServer = async ({
  port,
  appInstance,
  routeObject,
}) =>{
  if (!port) {
    console.log('The port no is requried to initiate a server');
    return;
  }
  await registerPlugins(port, appInstance, routeObject);

  appInstance.listen(port, ()=>{
    console.log(`The server started on port no ${port}`);
  });
};

const registerPlugins = async (port, appInstance, routeObject) =>{
  dotenv.config({
    path: Path.join(`${__dirname}`, '../../config.env'),
  });
  mongoose.connect(process.env.DATABASE?.replace('<password>', process.env.DATABASE_PASS), ()=>{
    console.log('The connection with the database was successful');
  });
  appInstance.use(morgan('dev'));
  appInstance.use(express.json());
  appInstance.use(express.static(`${__dirname}/../public`));
  appInstance.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));
  appInstance.use(cookieParser());
  // eslint-disable-next-line guard-for-in
  for (const route of routeObject) {
    appInstance.use(route?.prefix, route?.router);
  }
  // configuring swagger
  const spec = swaggerJSdocs(getSwaggerOption(port));
  appInstance.use('/api-docs', swaggerUI.serve, swaggerUI.setup(spec));
  appInstance.all('*', (request, response, next)=>{
    next(new AppError('The application is not supporting the requested web page', 404));
  });
  appInstance.use((error, reqeust, response, next) =>{
    const errorCode = error.errorCode || 404;
    const errorMessage = error.message || 'Not found';

    response.status(errorCode).json({
      status: 'fail',
      errorMessage,
      stack: error.stack,
    });
  });
};
