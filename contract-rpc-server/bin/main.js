const logger = require('../lib/logger')

const RPCServer = require('..')

const Web3Handler = require('../handles/web3-handler')

const server = new RPCServer({logger: logger()})

server.on('request', (request) => {
  request.on('data', (chunk) => {
    const body = JSON.parse(chunk)
    server.logger.info('function: %s, args: %j', body.method, body.params)
  })
})

server.addInstance(new Web3Handler())

server.startHTTP()
