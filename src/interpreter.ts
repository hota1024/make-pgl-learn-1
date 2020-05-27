import * as readline from 'readline'
import { Lexer, Parser, Evaluator } from './classes'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const lexer = new Lexer()
const parser = new Parser()
const evaluator = new Evaluator()

const input = () =>
  rl.question('-> ', (line) => {
    if (line === '.exit') {
      rl.close()
      return
    }

    const tokens = lexer.analyze(line)
    const ast = parser.parse(tokens)
    const result = evaluator.evaluate(ast)

    console.log(`<- ${result}`)

    input()
  })

console.log('To exit, press ^C again or ^D or type .exit')
input()
