// padi.js - Dapr CNS Padi broker
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const axios = require('axios');

// Constants

const PADI_CP = process.env.CNS_PADI_CP || 'https://cp.staging.padi.io';
const PADI_API = process.env.CNS_PADI_API || 'https://api.staging.padi.io';

const PADI_THING = process.env.CNS_PADI_THING || '4UKIvMwCBOXHVrJ7SpJ9';
const PADI_TOKEN = process.env.CNS_PADI_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJwYWRpLWFwcCIsImlzcyI6ImdXMVJxUk5jSzV3TTl4V0g3Y3ZmIiwic3ViIjoiNFVLSXZNd0NCT1hIVnJKN1NwSjkiLCJpYXQiOjE2OTU0NzI2Mjh9.h-Hkko-8sMWzi_pqzGeVul3mvhDIC3apOgTnG7bHbs4';

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
  console.log('Fetching Padi profile ' + profile);

  // Request profile
  const res = await cp.get('/profiles/' + profile);

  // Convert profile
  // ...

  return res.data;
}

// Get broker node
async function getNode() {
  console.log('Fetching Padi thing ' + PADI_THING);

  // Request thing
  const res = await api.get('/thing');

  const thing = res.data.padiThings[PADI_THING];
  const conns = res.data.padiConnections;

  // Convert connections
  const connections = {};

  for (const id in conns) {
    const conn = conns[id];

    connections[id] = {
      profile: conn.padiProfile || '',
      role: (conn.padiClient === PADI_THING)?'client':'server',
      client: conn.padiClientAlias || '',
      server: conn.padiServerAlias || '',
      status: conn.padiStatus || 'new',
      properties: conn.padiProperties || {}
    }
  }

  // Convert thing
  return {
    name: thing.dis || '',
    title: thing.geoAddr || '',
    comment: thing.padiComment || '',
    connections: connections
  };
}

//
async function setNode(data) {

}

// Exports

exports.getProfile = getProfile;

exports.getNode = getNode;
exports.setNode = setNode;
