const config = require('config')
const sphinxMeta = require('sphinx-meta')
const PrivateKeyProvider = require('./lib/private-key-provider')
const chainConf = config.get('chain')
const contract = require('./lib/contract')
const web3 = new (require('web3'))()
const log = console.log

const provider = new PrivateKeyProvider(chainConf.privateKey, chainConf.url)
const userId = 'FaGyHDysSI9pe0Y'
const creator = web3.fromUtf8(userId)
const from = {from: chainConf.coinbase}

const getContract = (contractName) => {
  const ContractClz = contract(sphinxMeta(chainConf.networks, contractName))
  ContractClz.setProvider(provider)

  return ContractClz
}

let proxy
let instance

const SphinxProxy = getContract('SphinxProxy')
SphinxProxy.deployed()
  .then((ins) => {
    proxy = ins
    const UserWallet = getContract('UserWallet')
    return UserWallet.deployed()
  })
  .then(async (ins) => {
    instance = ins
    const arr = Array.from(Array(2)).map(() => 0)
    arr.forEach((element) => {
      ins.addBalance.sendRawTransaction(creator, 1, from)
    })
  })
  .catch((err) => {
    log(err)
  })
