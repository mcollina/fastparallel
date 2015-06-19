# fastparallel [![Build Status](https://travis-ci.org/mcollina/fastparallel.svg?branch=master)](https://travis-ci.org/mcollina/fastparallel)

Zero-overhead parallel function call for node.js. Also supports each
and map!

Benchmark for doing 3 calls `setImmediate` 1 million times:

* non-reusable `setImmediate`: 2172ms
* `async.parallel`: 5739ms
* `async.each`: 3015ms
* `async.map`: 4981ms
* `parallelize`: 4846ms
* `fastparallel` with results: 2391ms
* `fastparallel` without results: 2350ms
* `fastparallel` map: 2351ms
* `fastparallel` each: 2359ms

These benchmarks where taken via `bench.js` on iojs 2.2.1, on a MacBook
Pro Retina 2014.

If you need zero-overhead series function call, check out
[fastseries](http://npm.im/fastseries). If you need a fast work queue
check out [fastq](http://npm.im/fastq). If you need to run fast
waterfall calls, use [fastfall](http://npm.im/fastfall).

[![js-standard-style](https://raw.githubusercontent.com/feross/standard/master/badge.png)](https://github.com/feross/standard)

## Example for parallel call

```js
var parallel = require('fastparallel')({
  // this is a function that will be called
  // when a parallel completes
  released: completed,

  // if you want the results, then here you are
  results: true
})

parallel(
  {}, // what will be this in the functions
  [something, something, something], // functions to call
  42, // the first argument of the functions
  done // the function to be called when the parallel ends
)

function something (arg, cb) {
  setImmediate(cb, null, 'myresult')
}

function done (err, results) {
  console.log('parallel completed, results:', results)
}

function completed () {
  console.log('parallel completed!')
}
```

## Example for each and map calls

```js
var parallel = require('fastparallel')({
  // this is a function that will be called
  // when a parallel completes
  released: completed,

  // if you want the results, then here you are
  // passing false disables map
  results: true
})

parallel(
  {}, // what will be this in the functions
  something, // functions to call
  [1, 2, 3], // the first argument of the functions
  done // the function to be called when the parallel ends
)

function something (arg, cb) {
  setImmediate(cb, null, 'myresult')
}

function done (err, results) {
  console.log('parallel completed, results:', results)
}

function completed () {
  console.log('parallel completed!')
}

```

## Caveats

The `results` array will be non-ordered, and the `done` function will
be called only once, even if more than one error happen.

This library works by caching the latest used function, so that running a new parallel
does not cause **any memory allocations**.

## License

ISC
