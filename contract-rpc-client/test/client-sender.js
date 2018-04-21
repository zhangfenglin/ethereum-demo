const config = require('config')
const HDWalletProvider = require('truffle-hdwallet-provider')
const sphinxMeta = require('sphinx-meta')
const contract = require('../lib/contract')
const chainConf = config.get('chain')
const Web3 = require('web3')
const uuid = require('uuid')

const log = console.log

const web3 = new Web3()

log(config)

const provider = new HDWalletProvider(chainConf.mnemonic, chainConf.url)
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
    return ins.getUserBalance(creator, from)
  })
  .then((result) => {
    log('balance : %o', result.toNumber())
    //   instance = ins
    //   return ins.addBalance.sendRawTransaction(creator, 1e21, from)
    // })
    // .then((txhash) => {
    //   log('txhash: %o', txhash)
    const OrderCreator = getContract('OrderCreator')
    return OrderCreator.deployed()
  })
  .then((ins) => {
    const units = 1e18
    const orderidStr = uuid.v4().replace(/-/g, '')
    log('orderId = %o', orderidStr)
    const orderid = web3.fromUtf8(orderidStr)
    const creator = web3.fromUtf8(userId)

    const data = [
      proxy.address,
      orderid,
      creator,
      'f824f224c8a9a77bcab6063f5df06e2f',
      100000000000000000000,
      69314718055994530000,
      1524305286713,
      1524305400000,
      'URL',
      "html(https://ethereumprice.org).xpath(//*[contains(@id, 'ep-price')]/text())",
      {from: '0xcd1dd2796e5444c1eae14edc1cd0312fffaa1652'}
    ]

    return ins.create.sendRawTransaction(...data)
  })
  .then((result) => {
    log('create order result: %o', result)
  })
  .catch((err) => {
    log(err)
  })
