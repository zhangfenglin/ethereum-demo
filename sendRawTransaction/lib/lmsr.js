const assert = require('assert')
const math = require('mathjs')
const BigNumber = require('bignumber.js')
const ZERO = 0

function LMSR(lossLimit, outcomeCount) {
  this.lossLimit = lossLimit
  this.outcomeCount = outcomeCount
  this.reserveFund = new BigNumber(this.lossLimit).multipliedBy(`${math.log(outcomeCount)}`)
  this.quantities = Array.from(Array(outcomeCount)).map(() => new BigNumber(ZERO))
}

LMSR.prototype.getReserveFund = function getReserveFund() {
  return this.reserveFund
}

LMSR.prototype.getPrice = function getPrice(outcomeIndex) {
  assert.ok(outcomeIndex < this.outcomeCount, 'outside of array size.')

  const dc = new BigNumber(`${math.exp(this.quantities[outcomeIndex].dividedBy(this.lossLimit).toNumber())}`)
  let dq = new BigNumber('0.0')
  for (let idx = ZERO; idx < this.quantities.length; idx++) {
    dq = new BigNumber(`${math.exp(this.quantities[idx].dividedBy(this.lossLimit).toNumber())}`).plus(dq)
  }

  const price = dc.dividedBy(dq)

  const minPrice = 0.00001
  if (price.isLessThan(minPrice)) {
    return new BigNumber(minPrice)
  }

  return price
}

LMSR.prototype.setQuantity = function setQuantity(index, quantity) {
  assert.ok(index < this.outcomeCount, 'outside of array size.')

  this.quantities[index] = this.quantities[index].plus(quantity)
}

LMSR.prototype.addQuantity = function addQuantity(index, quantity) {
  assert.ok(index < this.outcomeCount, 'outside of array size.')

  this.quantities[index] = this.quantities[index].plus(quantity)
}

LMSR.prototype.setQuantities = function setQuantities(quantities = []) {
  assert.ok(quantities.length === this.quantities.length, 'new array size not equal the old array size.')
  for (let idx = 0; idx < quantities.length; idx++) {
    this.quantities[idx] = new BigNumber(quantities[idx])
  }
}

LMSR.prototype.getQuantities = function getQuantities() {
  return this.quantities
}

module.exports = LMSR
