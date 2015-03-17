var test = require('tape')
var parallel = require('./')

test('basically works', function (t) {
  t.plan(6)

  var instance = parallel({
    released: released
  })
  var count = 0
  var obj = {}

  instance(obj, [something, something], 42, function done () {
    t.equal(count, 2, 'all functions must have completed')
  })

  function something (arg, cb) {
    t.equal(obj, this)
    t.equal(arg, 42)
    setImmediate(function () {
      count++
      cb()
    })
  }

  function released() {
    t.pass()
  }
})

test('accumulates results', function (t) {
  t.plan(8)

  var instance = parallel({
    released: released
  })
  var count = 0
  var obj = {}

  instance(obj, [something, something], 42, function done (err, results) {
    t.notOk(err, 'no error')
    t.equal(count, 2, 'all functions must have completed')
    t.deepEqual(results, [1, 2])
  })

  function something (arg, cb) {
    t.equal(obj, this)
    t.equal(arg, 42)
    setImmediate(function () {
      count++
      cb(null, count)
    })
  }

  function released() {
    t.pass()
  }
})

test('fowards errs', function (t) {
  t.plan(3)

  var instance = parallel({
    released: released
  })
  var count = 0
  var obj = {}

  instance(obj, [somethingErr, something], 42, function done (err, results) {
    t.error(err)
    t.equal(count, 2, 'all functions must have completed')
  })

  function something (arg, cb) {
    setImmediate(function () {
      count++
      cb(null, count)
    })
  }

  function somethingErr (arg, cb) {
    setImmediate(function () {
      count++
      cb(new Error('this is an err!'))
    })
  }

  function released() {
    t.pass()
  }
})

test('does not forward errors or result with results:false flag', function (t) {
  t.plan(8)

  var instance = parallel({
    released: released,
    results: false
  })
  var count = 0
  var obj = {}

  instance(obj, [something, something], 42, function done (err, results) {
    t.equal(err, undefined, 'no err')
    t.equal(results, undefined, 'no err')
    t.equal(count, 2, 'all functions must have completed')
  })

  function something (arg, cb) {
    t.equal(obj, this)
    t.equal(arg, 42)
    setImmediate(function () {
      count++
      cb()
    })
  }

  function released() {
    t.pass()
  }
})
