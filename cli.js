#!/usr/bin/env node
'use strict';

const createNewOc = require('./');
const args = require('get-them-args')(process.argv.slice(2));

const verbose = args.verbose || false;
const componentName = args.name;
const remoteOriginOfRepo = args.repo;

createNewOc({ componentName, remoteOriginOfRepo, logger: console }).catch((error) => {
  verbose && console.error(error?.message ?? error ?? 'Something went wrong.');
});
