const BaseClass = require('./base')

module.exports = class Web3Handler extends BaseClass {
  constructor(contracts, logger) {
    super()

    this.contracts = contracts
    this.logger = logger

    console.log(contracts)
  }

  async eth_sendRawTransaction(args) {
    return new Promise((resolve, reject) => {
      // console.log('run to here: ', ...args)
      const [contractName, functionName, ...params] = args
      console.log('run to here contractName: %o', contractName)
      console.log('run to here functionName: %o', functionName)
      console.log('run to here params: %o', params)

      // this.logger.info(this.contracts)

      this.contracts[contractName][functionName]
        .sendRawTransaction(...params)
        .then((result) => {
          console.info('execute contract result: %o', result)

          resolve(result)
        })
        .catch((err) => {
          console.info('execute contract error: %o', err)
          reject(err)
        })
    })
  }
}
