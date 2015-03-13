var test = require('tape')
var parallel = require('./')

test('basically works', function (t) {
  t.plan(6)

  var instance = parallel(released)
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
