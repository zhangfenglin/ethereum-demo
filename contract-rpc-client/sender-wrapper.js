const config = require('config')
const Sender = require('./lib/sender')

const rpcClient = require('jayson').client
const rpc = rpcClient.http(config.get('rpc.serverURL'))
const sender = new Sender({
  rpc
})

module.exports = sender
