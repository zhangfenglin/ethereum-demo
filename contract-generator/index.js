const log = (...args) => console.log('generate:', ...args)
const MetaAnalyzer = require('./lib/analyze-contract-meta')
const CodeGenerator = require('./lib/code-generator')

function main() {
  const analyzer = new MetaAnalyzer()
  const codeGenerator = new CodeGenerator()
  log('start generate contract')

  analyzer.start()

  const abis = analyzer.getABIs()
  abis.forEach((data) => {
    codeGenerator.render(data)
  })

  log('contract generate success !!!')
}

main()
