// index.js - Dapr CNS server
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Constants

const SERVER_HOST = process.env.CNS_SERVER_HOST || 'localhost';
const SERVER_PORT = process.env.CNS_SERVER_PORT || '3000';

const DAPR_HOST = process.env.CNS_DAPR_HOST || 'localhost';
const DAPR_PORT = process.env.CNS_DAPR_PORT || '3500';

const BROKER = process.env.CNS_BROKER || 'padi';

// Imports

const dapr = require('@dapr/dapr');
const broker = require('./brokers/' + BROKER + '.js');

// Local data

const cache = {
  profiles: {}
};

// Dapr server

const server = new dapr.DaprServer({
  serverHost: SERVER_HOST,
  serverPort: SERVER_PORT,
//  communicationProtocol: CommunicationProtocolEnum.GRPC,
//  serverHttp: app,
  clientOptions: {
    daprHost: DAPR_HOST,
    daprPort: DAPR_PORT
  }
});

// Dapr client
/*
const client = new dapr.DaprClient({
  DAPR_HOST,
  DAPR_PORT});*/

// Locate query in cach
function locate(query) {
  const parts = query.split('/');
  parts.shift();

  if (parts.length > 0) {
    var obj = cache;
    var key;

    while (parts.length > 0) {
      key = parts.shift();

      if (obj[key] === undefined)
        return null;

      if (parts.length > 0)
        obj = obj[key];
    }

    return {
      obj: obj,
      key: key
    }
  }
  return null;
}

// Get profile endpoint
async function getProfile(data) {
  const query = data.query;
  var res;

  try {
    // Profile cached?
    const profile = query.split('/')[2];

    if (cache.profiles[profile] === undefined)
      cache.profiles[profile] = await broker.getProfile(profile);

    // Locate query
    const loc = locate(query);

    if (loc === null)
      throw new Error('not found');

    res = loc.obj[loc.key];
  } catch(e) {
    // Failure
    console.log('GET ' + query + ' BAD: ' + e.message);
    return {error: 'bad request'};
  }
  // Success
  console.log('GET ' + query + ' OK');
  return {data: res};
}

// Get node endpoint
async function getNode(data) {
  //
  const query = data.query;
  var res;

  try {
    // Node cached?
    if (cache.node === undefined)
      cache.node = await broker.getNode();

    // Locate query
    const loc = locate(query);

    if (loc === null)
      throw new Error('not found');

    res = loc.obj[loc.key];
  } catch(e) {
    // Failure
    console.log('GET ' + query + ' BAD: ' + e.message);
    return {error: 'bad request'};
  }
  // Success
  console.log('GET ' + query + ' OK');
  return {data: res};
}

//
async function setNode(data) {
  const query = data.query;
//  var res;

  try {
    const body = JSON.parse(data.body);

console.log(body);

//  const loc = locate(query);

//  if (loc === null)
//    return {error: 'bad request'};

//  loc.obj[loc.key] = body;

  } catch(e) {
    // Failure
    console.log('POST ' + query + ' BAD: ' + e.message);
    return {error: 'bad request'};
  }
  // Success
  console.log('POST ' + query + ' OK');
  return {data: 'ok'};
}

// Server application
async function start() {
  // Endpoint listeners
  await server.invoker.listen('profiles/:profile*', getProfile, {method: dapr.HttpMethod.GET});

  await server.invoker.listen('node(/*)?', getNode, {method: dapr.HttpMethod.GET});
  await server.invoker.listen('node(/*)?', setNode, {method: dapr.HttpMethod.POST});

//  await server.invoker.listen('dapr/subscribe', (data) => {
//    console.log('sub!');
//  }, {method: dapr.HttpMethod.GET});

  // Start server
  await server.start();
}

// Start application
start().catch((e) => {
  console.error(e);
  process.exit(1);
});
