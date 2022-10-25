#!/usr/bin/env node
'use strict'

const createNewOc = require('./')
const args = require('get-them-args')(process.argv.slice(2))

const verbose = args.verbose || false
const name = args.name
const repo = args.repo

createNewOc(name, repo)
.then(() => {
    console.log(`${current} created`)
})
.catch((error) => {
    verbose && console.error(error)
})