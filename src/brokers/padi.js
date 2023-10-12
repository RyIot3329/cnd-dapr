// padi.js - Dapr CNS Padi broker
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const axios = require('axios');
const mqtt = require('mqtt');

const objects = require('../objects.js');

// Constants

const PADI_CP = process.env.CNS_PADI_CP || 'https://cp.staging.padi.io';
const PADI_API = process.env.CNS_PADI_API || 'https://api.staging.padi.io';
const PADI_MQTT = process.env.CNS_PADI_MQTT || 'wss://cns.staging.padi.io:1881';

const PADI_THING = process.env.CNS_PADI_THING || 'vUEFncafIxjGHgoIvwtB';
const PADI_TOKEN = process.env.CNS_PADI_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJwYWRpLWFwcCIsImlzcyI6IllRM0pCTnR1Wm9qeXdrU0VhUEhNIiwic3ViIjoidlVFRm5jYWZJeGpHSGdvSXZ3dEIiLCJpYXQiOjE2OTQwODQ3NjZ9.VLDDyCF6JoW35pXgGohQv2l_rHdQVREUWDykLiDsV0o';

// Service endpoints

const cp = axios.create({
  baseURL: PADI_CP,
  headers: {
    'Content-Type': 'application/json'
  }
});

const api = axios.create({
  baseURL: PADI_API,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + PADI_TOKEN
  }
});

// Get broker profile
async function getProfile(profile) {
  console.log('Getting Padi profile', profile);

  // Get profile request
  const res = await cp.get('/profiles/' + profile);
  return toProfile(res.data);
}

// Get broker node
async function getNode() {
  console.log('Getting Padi thing', PADI_THING);

  // Get thing request
  const res = await api.get('/thing');
  return toNode(res.data);
}

// Post broker node
async function postNode(data, cache) {
  // Convert to thing
  const thing = fromNode(data);

  if (!objects.isEmpty(thing)) {
    // Post thing request
    console.log('Posting Padi thing', PADI_THING);
    await api.post('/thing', thing);
  }

  // Has connections?
  const conns = data.connections;
  if (conns === undefined) return;

  // Post connections
  for (const id in conns) {
    // Convert to connection
    const conn = fromConnection(conns[id]);

    if (!objects.isEmpty(conn)) {
      // Needs all properties
      if (conn.padiProperties !== undefined)
        conn.padiProperties = cache.node.connections[id].properties;

      // Post connection request
      console.log('Posting Padi connection', id);
      await api.post('/thing/' + id, conn);
    }
  }
}

// Subscribe to node
async function subscribeNode(callback) {
  console.log('Subscribing Padi thing', PADI_THING);

  // Connect client
  const client = mqtt.connect(PADI_MQTT, {
    username: PADI_TOKEN
  })
  // Topic message
  .on('message', (topic, data) => {
    console.log('Message Padi thing', PADI_THING);
    callback(toNode(JSON.parse(data)));
  })
  // Failure
  .on('error', (e) => {
    console.error('Error:', e.message);
  });

  // Subscribe to thing
  client.subscribe('thing/' + PADI_THING);
}

// Convert to profile
function toProfile(data) {
  // From Padi profile
  return {
    name: data.name || '',
    title: data.title || '',
    comment: data.comment || '',
    versions: data.versions || []
  };
}

// Convert to node
function toNode(data) {
  // From Padi thing and connections
  const node = {};

  const thing = data.padiThings[PADI_THING];
  const conns = data.padiConnections;

  // Convert connections
  const connections = {};

  for (const id in conns)
    connections[id] = toConnection(conns[id]);

  return {
    name: thing.dis || '',
    title: thing.geoAddr || '',
    comment: thing.padiComment || '',
    connections: connections
  };
}

// Convert to connection
function toConnection(data) {
  // From Padi connection
  return {
    profile: data.padiProfile || '',
    versions: data.padiVersion || '',
    role: (data.padiClient === PADI_THING)?'client':'server',
    client: data.padiClientAlias || '',
    server: data.padiServerAlias || '',
    status: data.padiStatus || '',
    properties: data.padiProperties || []
  };
}

// Convert from node
function fromNode(data) {
  // To Padi thing
  const thing = {};

  if (data.name !== undefined) thing.dis = data.name;
  if (data.title !== undefined) thing.geoAddr = data.title;
  if (data.comment !== undefined) thing.padiComment = data.comment;

  return thing;
}

// Convert from connection
function fromConnection(data) {
  // To Padi connection
  const conn = {};

  if (data.status !== undefined) conn.padiStatus = data.status;
  if (data.properties !== undefined) conn.padiProperties = data.properties;

  return conn;
}
// Exports

exports.getProfile = getProfile;

exports.getNode = getNode;
exports.postNode = postNode;

exports.subscribeNode = subscribeNode;
