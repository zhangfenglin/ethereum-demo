const truffleContract = require('truffle-contract')
const R = require('ramda')
const Tx = require('ethereumjs-tx')
const sender = require('./sender-wrapper')

class Contract {
  constructor() {
    this.bindSendRawTransaction = this.bindSendRawTransaction.bind(this)
    this.send = this.send.bind(this)
  }

  createContractClz(opts = {}) {
    this.contractClz = truffleContract(opts)
  }

  setProvider(provider) {
    this.contractClz.setProvider(provider)
  }

  async send(contractName, functionName, args, done) {
    try {
      const result = await sender.send('web3handler.eth_sendRawTransaction', contractName, functionName, ...args)
      done(null, result)
    } catch (err) {
      console.log('exception at contract: ', err)
      done(err)
    }
  }

  bindSendRawTransaction(functionName) {
    const self = this

    const getData = self.contractInstance.contract[functionName].getData
    const web3 = self.contractInstance.constructor.web3
    const ownerAddress = web3.currentProvider.provider.address

    this.contractInstance[functionName].sendRawTransaction = (...args) =>
      new Promise((resolve, reject) => {
        const from = {}
        if (args.length === 0) {
          from.from = ownerAddress
        } else {
          const tmp = args[args.length - 1].from
          if (R.isNil(tmp)) {
            from.from = ownerAddress
          } else {
            from.from = tmp
          }
        }

        self.send(self.contractInstance.constructor._json.contractName, functionName, args, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
  }

  addSendRawTransactionFunc() {
    const abi = this.contractClz.abi || []
    const self = this

    abi.forEach((element) => {
      if (element.type === 'function') {
        self.bindSendRawTransaction(element.name)
      }
    })
  }

  async deployed(...args) {
    this.contractInstance = await this.contractClz.deployed(args)
    this.addSendRawTransactionFunc()
    return this.contractInstance
  }
}

const instance = new Contract()

function ContractHelper(opts = {}) {
  instance.createContractClz(opts)
  return instance
}

module.exports = ContractHelper
