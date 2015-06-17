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

  function released () {
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

  function released () {
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

  function released () {
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

  function released () {
    t.pass()
  }
})

test('should call done and released if an empty is passed', function (t) {
  t.plan(2)

  var instance = parallel({
    released: released
  })
  var obj = {}

  instance(obj, [], 42, function done () {
    t.pass()
  })

  function released () {
    t.pass()
  }
})

test('each support', function (t) {
  t.plan(8)

  var instance = parallel({
    released: released
  })
  var count = 0
  var obj = {}
  var args = [1, 2, 3]
  var i = 0

  instance(obj, something, args, function done () {
    t.equal(count, 3, 'all functions must have completed')
  })

  function something (arg, cb) {
    t.equal(obj, this, 'this matches')
    t.equal(args[i++], arg, 'the arg is correct')
    setImmediate(function () {
      count++
      cb()
    })
  }

  function released () {
    t.pass()
  }
})

test('call the callback with the given this', function (t) {
  t.plan(1)

  var instance = parallel()
  var obj = {}

  instance(obj, [build(), build()], 42, function done () {
    t.equal(obj, this, 'this matches')
  })

  function build () {
    return function something (arg, cb) {
      setImmediate(cb)
    }
  }
})

test('call the callback with the given this with no results', function (t) {
  t.plan(1)

  var instance = parallel({ results: false })
  var obj = {}

  instance(obj, [build(), build()], 42, function done () {
    t.equal(obj, this, 'this matches')
  })

  function build () {
    return function something (arg, cb) {
      setImmediate(cb)
    }
  }
})

test('call the callback with the given this with no data', function (t) {
  t.plan(1)

  var instance = parallel()
  var obj = {}

  instance(obj, [], 42, function done () {
    t.equal(obj, this, 'this matches')
  })
})

test('call the result callback when the each array is empty', function (t) {
  t.plan(1)

  var instance = parallel()
  var obj = {}

  instance(obj, something, [], function done () {
    t.pass('the result function has been called')
  })

  function something (arg, cb) {
    t.error('this should never be called')
  }
})

test('call the result callback when the each array is empty with no results', function (t) {
  t.plan(1)

  var instance = parallel({ results: false })
  var obj = {}

  instance(obj, something, [], function done () {
    t.pass('the result function has been called')
  })

  function something (arg, cb) {
    t.error('this should never be called')
  }
})
