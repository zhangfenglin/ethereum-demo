const Tx = require('ethereumjs-tx')
const truffleContract = require('truffle-contract')
const ethUtil = require('ethereumjs-util')
const levelup = require('levelup')
const leveldown = require('leveldown')
const path = require('path')

const ZERO = 0
const ONE = 1

const db = levelup(leveldown(path.resolve('nonce-cache')))

const Utils = {
  init() {},
  normalize(contract) {
    const abi = contract.abi || []
    for (let idx = 0; idx < abi.length; idx++) {
      const item = abi[idx]
      if (item.type === 'function') {
        contract[item.name].sendRawTransaction = Utils.sendRawTransaction(contract, item.name)
      }
    }
  },
  sendRawTransaction(contract, fn) {
    const getData = contract.contract[fn].getData
    const web3 = contract.constructor.web3
    const ownerAddress = web3.currentProvider.provider.address
    return function transaction(...args) {
      return new Promise((resolve, reject) => {
        if (args.length === ZERO) {
          reject(Error('input paramter must give "from" property'))

          return
        }

        const from = args[args.length - ONE].from
        if (!from) {
          reject(Error('input paramter must give "from" property'))

          return
        }

        console.log('ownerAddress = %o', ownerAddress)

        web3.eth.getGasPrice((err, price) => {
          if (err) {
            reject(err)
          } else {
            const sendTransaction = (cacheNonce) => {
              web3.eth.getTransactionCount(from, 'pending', (error, nonce) => {
                if (error) {
                  reject(error)
                } else {
                  try {
                    if (cacheNonce && nonce < cacheNonce) {
                      nonce = cacheNonce
                    }

                    const rawTx = {
                      nonce,
                      gasPrice: price.toNumber(),
                      // 3000000 gas limit
                      gasLimit: '0x2dc6c0',
                      to: contract.address,
                      data: getData(...args)
                    }

                    const tx = new Tx(rawTx)
                    tx.sign(web3.currentProvider.provider.wallet._privKey)
                    const serializedTx = tx.serialize()

                    console.log('current nonce = %o', nonce)

                    db.put(ownerAddress, ethUtil.toBuffer(nonce + 1))

                    web3.eth.sendRawTransaction(`0x${serializedTx.toString('hex')}`, (err1, hash) => {
                      if (err1) {
                        reject(err1)
                      } else {
                        resolve(hash)
                      }
                    })
                  } catch (exception) {
                    reject(exception)
                  }
                }
              })
            }

            db.get(ownerAddress, (err, value) => {
              console.log('cache nonce = %o', ethUtil.bufferToInt(value))
              sendTransaction(ethUtil.bufferToInt(value))
            })
          }
        })
      })
    }
  }
}

function Contract(options) {
  this.contractClass = truffleContract(options)
}

Contract.prototype.deployed = async function deployed() {
  this.instance = await this.contractClass.deployed()
  Utils.normalize(this.instance)

  return this.instance
}

Contract.prototype.setProvider = function setProvider(provider) {
  this.contractClass.setProvider(provider)
}

function ContractHelper(options) {
  return new Contract(options)
}

module.exports = ContractHelper
