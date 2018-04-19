const LMSR = require('./lib/lmsr')
const BigNumber = require('bignumber.js')

const log = console.log

const units = 1e18
const losslimit = 100 * units
const resultCount = 2

const lmsr = new LMSR(losslimit, resultCount)

const price0 = lmsr.getPrice(0)
const buy0 = 15000 * units
const count0 = new BigNumber(buy0).dividedBy(price0)

log('price0 = %o , count0 = %o', price0.toNumber(), count0.toNumber())
lmsr.addQuantity(0, count0)

const price1 = lmsr.getPrice(1)
const buy1 = 50 * units
const count1 = new BigNumber(buy1).dividedBy(price1)

log('price1 = %o , count1 = %o', price1.toNumber(), count1.toNumber())
