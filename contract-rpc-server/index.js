const {EventEmitter} = require('events')
const jayson = require('jayson')
const config = require('config')
const debug = require('debug')('contract:rpc:server')

class ContractRpcServer extends EventEmitter {
  constructor({logger}) {
    super()
    this.methods = Object.create(null)

    this.logger = logger
  }

  addInstance(instance) {
    if (instance.constructor.toString() !== 'constructor class') {
      throw new Error('classFn must be class')
    }

    const methods = Object.getOwnPropertyNames(instance.constructor.prototype).filter((name) => name !== 'constructor')

    this.logger.info('methods: %o', methods)

    let scope = instance.name || instance.constructor.name || ''
    scope = scope.toLowerCase()

    if (methods.length === 0) {
      throw new Error('methods is empty')
    }

    methods.forEach((method) => {
      const scopeMethod = `${scope}.${method}`

      this.logger.info(scopeMethod)

      this.methods[scopeMethod] = async function(args, done) {
        const promise = instance[method].bind(instance, Object.keys(args).map((key) => args[key]))
        try {
          const result = await promise()
          return done(null, result)
        } catch (err) {
          return done(err)
        }
      }
    })

    return this
  }

  /**
   * start server
   */
  startHTTP() {
    const logger = this.logger
    const self = this

    this.server = new jayson.Server(this.methods, {
      collect: true,
      params: Object
    })

    const port = config.get('rpc.port')
    this.server.on('http request', (message) => self.emit('request', message))
    this.server.on('http response', (response) => self.emit('response', response))

    return new Promise((resolve, reject) => {
      this.server.http().listen(port, () => {
        logger.info(`server start at ${port}`)
        resolve()
      })

      this.server.http().on('error', reject)
    })
  }
}

module.exports = ContractRpcServer
