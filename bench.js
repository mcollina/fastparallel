
var max = 1000000
var parallel = require('./')()
var async = require('async')
var obj = {}

function bench (func, done) {
  var key = max + '*' + func.name
  var count = -1

  console.time(key)
  end()

  function end() {
    if (++count < max) {
      func(end)
    } else {
      console.timeEnd(key)
      if (done) {
        done()
      }
    }
  }
}

function benchFastParallel(done) {
  parallel({}, [somethingP, somethingP, somethingP], 42, done)
}

function benchAsync(done) {
  async.parallel([somethingA, somethingA, somethingA], done)
}

var nextDone;
var nextCount;

function benchSetImmediate(done) {
  nextCount = 3
  nextDone = done
  setImmediate(somethingImmediate)
  setImmediate(somethingImmediate)
  setImmediate(somethingImmediate)
}

function somethingImmediate() {
  nextCount--
  if (nextCount === 0) {
    nextDone()
  }
}

function somethingP(arg, cb) {
  setImmediate(cb)
}

function somethingA(cb) {
  setImmediate(cb)
}

bench(benchFastParallel, function() {
  bench(benchAsync, function() {
    bench(benchSetImmediate)
  })
})
