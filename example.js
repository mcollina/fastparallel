var parallel = require('./')({
  // this is a function that will be called
  // when a parallel completes
  released: completed,

  // the maximum number of elements in the cache,
  // tune accordingly
  maxCache: 42
})

parallel(
  {}, // what will be this in the functions
  [something, something, something], // functions to call
  42, // the first argument of the functions
  done // the function to be called when the parallel ends
)

function something(arg, cb) {
  setImmediate(cb, null, 'myresult')
}

function done(err, results) {
  console.log('parallel completed, results:', results)
}

function completed() {
  console.log('parallel completed!')
}
