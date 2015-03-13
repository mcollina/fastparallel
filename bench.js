
var max = 100000
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

function benchParallel(done) {
  parallel({}, [somethingP, somethingP, somethingP], 42, done)
}

function benchAsync(done) {
  async.parallel([somethingA, somethingA, somethingA], done)
}

function benchSetImmediate(done) {
  setImmediate(done)
}

function somethingP(arg, cb) {
  setImmediate(cb)
}

function somethingA(cb) {
  setImmediate(cb)
}

bench(benchParallel, function() {
  bench(benchAsync, function() {
    bench(benchSetImmediate)
  })
})
