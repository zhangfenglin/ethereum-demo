const log = (...args) => console.log('meta-analyze:', ...args)
const R = require('ramda')
const fs = require('fs')
const path = require('path')

const contractMeta = require('sphinx-meta/contract-meta-utils')

class MetaAnalyzer {
  constructor() {
    this.contractABIs = []
  }

  start() {
    log('start analyze')

    const rootPath = contractMeta.rootPath('privatenet')
    const files = fs.readdirSync(rootPath)
    log(rootPath)
    const meta = files.map((file) => {
      return require(path.join(rootPath, file))
    })

    meta.forEach((element) => {
      if (!R.isEmpty(element.networks)) {
        const list = []

        element.abi.forEach((abi) => {
          if (abi.type === 'function') {
            list.push(abi)
          }
        })
        if (list.length > 0) {
          this.contractABIs.push({
            contractName: element.contractName,
            abi: list
          })
        }
      }
    })
  }

  getABIs() {
    return this.contractABIs
  }
}

module.exports = MetaAnalyzer
