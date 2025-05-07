'use strict'

const max = 1000000
const parallel = require('./')()
const parallelNoResults = require('./')({ results: false })
const bench = require('fastbench')
const async = require('async')
const neo = require('neo-async')

const funcs = []

for (let i = 0; i < 25; i++) {
  funcs.push(something)
}

function benchFastParallel (done) {
  parallel(null, funcs, 42, done)
}

function benchFastParallelNoResults (done) {
  parallelNoResults(null, funcs, 42, done)
}

function benchAsyncParallel (done) {
  async.parallel(funcs, done)
}

function benchNeoParallel (done) {
  neo.parallel(funcs, done)
}

function something (cb) {
  setImmediate(cb)
}

const run = bench([
  benchAsyncParallel,
  benchNeoParallel,
  benchFastParallel,
  benchFastParallelNoResults
], max)

run(run)
