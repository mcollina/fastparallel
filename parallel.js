function parallel (released) {
  var queue = []

  released = released || nop

  function instance (that, toCall, arg, done) {
    var holder = queue.shift()
    var i

    if (!holder) {
      holder = new Holder(release)
    }

    holder._count = toCall.length
    holder._callback = done

    for (i = 0; i < toCall.length; i++) {
      toCall[i].call(that, arg, holder.release)
    }
  }

  function release (holder) {
    queue.push(holder)
    released()
  }

  return instance
}

function Holder (_release) {
  this._count = -1
  this._callback
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
