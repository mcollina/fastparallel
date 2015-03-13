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

  var that = this
  this.release = function () {
    that._count--

    if (that._count === 0) {
      that._callback()
      that._callback = nop
      _release(that)
    }
  }
}

function nop () { }

module.exports = parallel
