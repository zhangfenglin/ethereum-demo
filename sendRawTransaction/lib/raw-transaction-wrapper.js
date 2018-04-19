const Transaction = require('ethereumjs-tx')
const R = require('ramda')
const TransactionQueue = require('./transaction-queue')

const Subprovider = require('web3-provider-engine/subproviders/subprovider')
const inherits = require('util').inherits

function RawTransactionWrapper() {
  this.nonceCache = {}
  this.transactionQueue = new TransactionQueue()
  this.isTransactionRunning = false
}

inherits(RawTransactionWrapper, Subprovider)

RawTransactionWrapper.prototype.getTransactionCount = (web3, from) =>
  new Promise((resolve, reject) => {
    web3.eth.getTransactionCount(from, 'pending', (err, nonce) => {
      if (err) {
        reject(err)
      } else {
        resolve(nonce)
      }
    })
  })

RawTransactionWrapper.prototype.handleRequest = async function(payload, next, end) {
  const self = this

  switch (payload.method) {
    case 'eth_sendRawTransaction': {
      const data = payload.params[0]
      const [rawTx, web3, from] = data

      self.transactionQueue.enqueue(rawTx, {payload, next, end})
      self.sendQueueTransaction(web3, from.from)
      break
    }

    default:
      next()
  }
}

RawTransactionWrapper.prototype.sendQueueTransaction = async function(web3, from) {
  const self = this

  if (self.isTransactionRunning) {
    return
  }

  self.isTransactionRunning = true

  if (self.transactionQueue.size() > 0) {
    const transactionData = self.transactionQueue.dequeue()

    const {payload, next} = transactionData.payload

    if (R.isNil(transactionData)) {
      self.isTransactionRunning = false
      self.sendQueueTransaction(web3, from)
    } else {
      if (R.isNil(self.nonceCache[from])) {
        const nonce = await self.getTransactionCount(web3, from)
        self.nonceCache[from] = nonce
      }

      const rawTx = transactionData.value
      rawTx.nonce = self.nonceCache[from]

      const transaction = new Transaction(rawTx)
      transaction.sign(web3.currentProvider.provider.wallet._privKey)

      const serializedTx = transaction.serialize()
      payload.params[0] = `0x${serializedTx.toString('hex')}`

      self.nonceCache[from]++

      next((err, result, cb) => {
        if (err) {
          cb(err)
        } else {
          cb(err, result)
        }

        console.log('send raw transaction result: %o', result)

        self.isTransactionRunning = false
        self.sendQueueTransaction(web3, from)
      })
    }
  }
}

module.exports = RawTransactionWrapper
