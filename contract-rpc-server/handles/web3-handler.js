const BaseClass = require('./base')

module.exports = class Web3Handler extends BaseClass {
  async eth_sendRawTransaction(args) {
    return new Promise((resolve, reject) => {
      console.log('run to here: ', ...args)
      resolve('adfajdfkla')
    })
  }
}
