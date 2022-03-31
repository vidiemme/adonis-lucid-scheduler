const { Compiler } = require('@adonisjs/assembler/build/src/Compiler')
const path = require('path')

try {
  const compiler = new Compiler(path.join(__dirname, '..'), [], false, undefined, 'tsconfig.json')
  const stopOnError = true
  const compiled = compiler.compileForProduction(stopOnError, 'npm')

  if (!compiled) process.exit(1)
} catch (ex) {
  throw ex
}
