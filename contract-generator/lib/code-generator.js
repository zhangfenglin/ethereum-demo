const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const R = require('ramda')
const config = require('config')

const log = (...args) => console.log('code-generator:', ...args)
const targetPath = config.get('target')

class CodeGenerator {
  render(data) {
    log(`generate contract ${data.contractName} code.`)

    const contractTp = fs.readFileSync(path.resolve('templates/contract.tp'))
    if (!R.isNil(contractTp)) {
      const inputData = contractTp.toString()
      const result = ejs.render(inputData, {name: data.contractName, abi: data.abi})
      const filePath = path.resolve(targetPath, `${data.contractName}.js`)

      const destDir = path.resolve(targetPath)
      if (!fs.existsSync(path.resolve(targetPath))) {
        fs.mkdirSync(destDir)
      }

      fs.writeFile(filePath, result, (err) => {
        if (err) {
          log(err)
        }
      })
    }
  }
}

module.exports = CodeGenerator
