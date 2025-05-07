const max = 1000000
const parallel = require('./')()
const parallelNoResults = require('./')({ results: false })
const bench = require('fastbench')
const async = require('async')
const neo = require('neo-async')
const insync = require('insync')
const items = require('items')
const parallelize = require('parallelize')

function benchFastParallel (done) {
  parallel(null, [somethingP, somethingP, somethingP], 42, done)
}

function benchFastParallelNoResults (done) {
  parallelNoResults(null, [somethingP, somethingP, somethingP], 42, done)
}

function benchFastParallelEach (done) {
  parallelNoResults(null, somethingP, [1, 2, 3], done)
}

function benchFastParallelEachResults (done) {
  parallel(null, somethingP, [1, 2, 3], done)
}

function benchAsyncParallel (done) {
  async.parallel([somethingA, somethingA, somethingA], done)
}

function benchInsyncParallel (done) {
  insync.parallel([somethingA, somethingA, somethingA], done)
}

function benchNeoParallel (done) {
  neo.parallel([somethingA, somethingA, somethingA], done)
}

function benchItemsParallel (done) {
  items.parallel.execute([somethingA, somethingA, somethingA], done)
}

function benchParallelize (done) {
  const next = parallelize(done)

  somethingA(next())
  somethingA(next())
  somethingA(next())
}

function benchAsyncEach (done) {
  async.each([1, 2, 3], somethingP, done)
}

function benchNeoEach (done) {
  neo.each([1, 2, 3], somethingP, done)
}

function benchAsyncMap (done) {
  async.map([1, 2, 3], somethingP, done)
}

function benchNeoMap (done) {
  neo.map([1, 2, 3], somethingP, done)
}

function benchInsyncEach (done) {
  insync.each([1, 2, 3], somethingP, done)
}

function benchInsyncMap (done) {
  insync.map([1, 2, 3], somethingP, done)
}

let nextDone
let nextCount

function benchSetImmediate (done) {
  nextCount = 3
  nextDone = done
  setImmediate(somethingImmediate)
  setImmediate(somethingImmediate)
  setImmediate(somethingImmediate)
}

function somethingImmediate () {
  nextCount--
  if (nextCount === 0) {
    nextDone()
  }
}

function somethingP (arg, cb) {
  setImmediate(cb)
}

function somethingA (cb) {
  setImmediate(cb)
}

const run = bench([
  benchSetImmediate,
  benchAsyncParallel,
  benchAsyncEach,
  benchAsyncMap,
  benchNeoParallel,
  benchNeoEach,
  benchNeoMap,
  benchInsyncParallel,
  benchInsyncEach,
  benchInsyncMap,
  benchItemsParallel,
  benchParallelize,
  benchFastParallel,
  benchFastParallelNoResults,
  benchFastParallelEachResults,
  benchFastParallelEach
], max)

run(run)
