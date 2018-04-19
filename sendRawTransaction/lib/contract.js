const truffleContract = require('truffle-contract')
const R = require('ramda')
const Tx = require('ethereumjs-tx')

class Contract {
  constructor() {
    this.bindSendRawTransaction = this.bindSendRawTransaction.bind(this)
  }

  createContractClz(opts = {}) {
    this.contractClz = truffleContract(opts)
  }

  setProvider(provider) {
    this.contractClz.setProvider(provider)
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

        web3.eth.getGasPrice((err, value) => {
          if (err) {
            reject(err)
          } else {
            const gasePrice = value

            const rawTx = {
              gasPrice: gasePrice.toNumber(),
              // 3000000 gas limit
              gasLimit: '0x2dc6c0',
              to: self.contractInstance.contract.address,
              data: getData(...args)
            }

            web3.eth.sendRawTransaction([rawTx, web3, from], (exception, txHash) => {
              if (exception) {
                reject(exception)
              } else {
                resolve(txHash)
              }
            })
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
