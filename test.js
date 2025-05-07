const test = require('tape')
const parallel = require('./')

test('basically works', function (t) {
  t.plan(6)

  const instance = parallel({
    released
  })
  let count = 0
  const obj = {}

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
    t.pass('release')
  }
})

test('accumulates results', function (t) {
  t.plan(8)

  const instance = parallel({
    released
  })
  let count = 0
  const obj = {}

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

  const instance = parallel({
    released
  })
  let count = 0
  const obj = {}

  instance(obj, [somethingErr, something], 42, function done (err, results) {
    t.ok(err)
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

test('fowards errs (bis)', function (t) {
  t.plan(3)

  const instance = parallel({
    released
  })
  let count = 0
  const obj = {}

  instance(obj, [something, somethingErr], 42, function done (err, results) {
    t.ok(err)
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

  const instance = parallel({
    released,
    results: false
  })
  let count = 0
  const obj = {}

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

  const instance = parallel({
    released
  })
  const obj = {}

  instance(obj, [], 42, function done () {
    t.pass()
  })

  function released () {
    t.pass()
  }
})

test('each support', function (t) {
  t.plan(8)

  const instance = parallel({
    released
  })
  let count = 0
  const obj = {}
  const args = [1, 2, 3]
  let i = 0

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

  const instance = parallel()
  const obj = {}

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

  const instance = parallel({ results: false })
  const obj = {}

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

  const instance = parallel()
  const obj = {}

  instance(obj, [], 42, function done () {
    t.equal(obj, this, 'this matches')
  })
})

test('call the result callback when the each array is empty', function (t) {
  t.plan(1)

  const instance = parallel()
  const obj = {}

  instance(obj, something, [], function done () {
    t.pass('the result function has been called')
  })

  function something (arg, cb) {
    t.error('this should never be called')
  }
})

test('call the result callback when the each array is empty with no results', function (t) {
  t.plan(1)

  const instance = parallel({ results: false })
  const obj = {}

  instance(obj, something, [], function done () {
    t.pass('the result function has been called')
  })

  function something (arg, cb) {
    t.error('this should never be called')
  }
})

test('does not require a done callback', function (t) {
  t.plan(4)

  const instance = parallel()
  const obj = {}

  instance(obj, [something, something], 42)

  function something (arg, cb) {
    t.equal(obj, this)
    t.equal(arg, 42)
    setImmediate(cb)
  }
})

test('works with sync functions with no results', function (t) {
  t.plan(6)

  const instance = parallel({
    results: false,
    released
  })
  let count = 0
  const obj = {}

  instance(obj, [something, something], 42, function done () {
    t.equal(2, count, 'all functions must have completed')
  })

  function something (arg, cb) {
    t.equal(this, obj)
    t.equal(42, arg)
    count++
    cb()
  }

  function released () {
    t.pass('release')
  }
})

test('accumulates results in order', function (t) {
  t.plan(8)

  const instance = parallel({
    released
  })
  let count = 2
  const obj = {}

  instance(obj, [something, something], 42, function done (err, results) {
    t.notOk(err, 'no error')
    t.equal(count, 0, 'all functions must have completed')
    t.deepEqual(results, [2, 1])
  })

  function something (arg, cb) {
    t.equal(obj, this)
    t.equal(arg, 42)
    const value = count--
    setTimeout(function () {
      cb(null, value)
    }, 10 * value)
  }

  function released () {
    t.pass()
  }
})

test('call without arg if there is no arg with no results', function (t) {
  t.plan(3)

  const instance = parallel({
    results: false
  })
  let count = 0
  const obj = {}

  instance(obj, [something, something], 42, function done () {
    t.equal(count, 2, 'all functions must have completed')
  })

  function something (cb) {
    t.equal(obj, this)
    setImmediate(function () {
      count++
      cb()
    })
  }
})

test('call without arg if there is no arg with results', function (t) {
  t.plan(3)

  const instance = parallel()
  let count = 0
  const obj = {}

  instance(obj, [something, something], 42, function done () {
    t.equal(count, 2, 'all functions must have completed')
  })

  function something (cb) {
    t.equal(obj, this)
    setImmediate(function () {
      count++
      cb()
    })
  }
})

test('each support with nothing to process', function (t) {
  t.plan(2)

  const instance = parallel()
  const obj = {}
  const args = []

  instance(obj, something, args, function done (err, results) {
    t.error(err)
    t.deepEqual(results, [], 'empty results')
  })

  function something (arg, cb) {
    t.fail('this should never happen')
  }
})

test('each without results support with nothing to process', function (t) {
  t.plan(1)

  const instance = parallel({ results: false })
  const obj = {}
  const args = []

  instance(obj, something, args, function done () {
    t.pass('done called')
  })

  function something (arg, cb) {
    t.fail('this should never happen')
  }
})

test('each works with arrays of objects', function (t) {
  t.plan(3)

  const instance = parallel({ results: false })
  const obj = {}
  const args = [{ val: true }, { val: true }]

  instance(obj, something, args, function () {
    t.ok('done called')
  })

  function something (arg, cb) {
    t.ok(arg.val)
    cb()
  }
})

test('using same instance multiple times clears the state of result holder', function (t) {
  const total = 10
  t.plan(total)

  const instance = parallel({
    results: false,
    released
  })
  const obj = {}
  let count = 0

  function released () {
    if (count < total) {
      instance(obj, [something], 42, function done () {
        t.ok(true, 'done is called')
        count++
      })
    }
  }

  released()
  function something (cb) {
    setImmediate(function () {
      cb()
    })
  }
})
