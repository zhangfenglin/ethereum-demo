const path = require('path')

class TransactionQueue {
  constructor() {
    this.cache = Array.from([])
  }

  enqueue(value, {payload, next, end}) {
    this.cache.push({value, payload: {payload, next, end}})
  }

  dequeue() {
    return this.cache.shift()
  }

  size() {
    return this.cache.length
  }
}

module.exports = TransactionQueue
