const config = require('config')
const logger = require('../lib/logger')
const RPCServer = require('..')
const Web3Handler = require('../handles/web3-handler')
const sphinxMeta = require('sphinx-meta')
const Promise = require('bluebird')
const {contract: truffle, TruffleContractProvider} = require('sphinx-truffle-provider')

const provider = new TruffleContractProvider(config.get('chain.privateKey'), config.get('chain.url'))

async function getContract(contractName) {
  const meta = sphinxMeta(config.get('chain.network'), contractName)
  const contract = truffle(meta)
  contract.setProvider(provider)
  const deployed = await contract.deployed()

  return deployed
}

const AllSupportContracts = [
  'DoubleSelectionTopic',
  'OrderCreator',
  'Orders',
  'Prediction',
  'Rewards',
  'SphinxProxy',
  'SphinxToken',
  'UserWallet'
]

new Promise.map(AllSupportContracts, getContract).then((ret) => {
  const [DoubleSelectionTopic, OrderCreator, Orders, Prediction, Rewards, SphinxProxy, SphinxToken, UserWallet] = ret

  const server = new RPCServer({logger: logger()})

  server.on('request', (request) => {
    request.on('data', (chunk) => {
      const body = JSON.parse(chunk)
      server.logger.info('function: %s, args: %j', body.method, body.params)
    })
  })

  server.addInstance(
    new Web3Handler(
      {
        DoubleSelectionTopic,
        OrderCreator,
        Orders,
        Prediction,
        Rewards,
        SphinxProxy,
        SphinxToken,
        UserWallet
      },
      server.logger
    )
  )

  server.startHTTP()
})
