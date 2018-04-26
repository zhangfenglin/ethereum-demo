const MetaAnalyzer = require('./lib/analyze-contract-meta')
const CodeGenerator = require('./lib/code-generator')
const log = (...args) => console.log('generate:', ...args)
const logWarn = (...args) => console.warn('generate:', ...args)

function main() {
  let network = 'privatenet' //process.args
  if (process.argv.length < 3) {
    logWarn('please choose which network you want to generate.')
  } else {
    network = process.argv[2]
  }

  const analyzer = new MetaAnalyzer()
  const codeGenerator = new CodeGenerator()
  log(`start generate ${network} contract code.`)

  analyzer.start(network)

  const abis = analyzer.getABIs()
  abis.forEach((data) => {
    codeGenerator.render(data)
  })

  log('contract generate success !!!')
}

main()
