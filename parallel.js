var xtend = require('xtend')
var defaults = {
  released: nop,
  results: true
}

function parallel (options) {
  options = xtend(defaults, options)

  var released = options.released
  var maxCache = options.maxCache
  var Holder = options.results ? ResultsHolder : NoResultsHolder
  var last = new Holder(release)

  function instance (that, toCall, arg, done) {
    var holder = last || new Holder(release)
    var i

    last = null

    holder._count = toCall.length
    holder._callback = done

    for (i = 0; i < toCall.length; i++) {
      toCall[i].call(that, arg, holder.release)
    }
  }

  function release (holder) {
    last = holder
    released()
  }

  return instance
}

function NoResultsHolder (_release) {
  this._count = -1
  this._callback = nop

  var that = this
  this.release = function (err, result) {
    that._count--

    if (that._count === 0) {
      that._callback()
      that._callback = nop
      _release(that)
    }
  }
}

function ResultsHolder (_release) {
  this._count = -1
  this._callback = nop
  this._results = []
  this._err = null

  var that = this
  this.release = function (err, result) {
    that._count--

    that._err = err
    that._results.push(result)
    if (that._count === 0) {
      that._callback(that._err, that._results)
      that._callback = nop
      that._results = []
      that._err = null
      _release(that)
    }
  }
}

function nop () { }

module.exports = parallel
