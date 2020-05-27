import * as readline from 'readline'
import {
  Lexer,
  Parser,
  Evaluator,
  LexerError,
  ParseError,
  EvaluatorReferenceError,
} from './classes'
import { Token, AST } from './types'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const lexer = new Lexer()
const parser = new Parser()
const evaluator = new Evaluator()

const analyzeOrFalse = (formula: string) => {
  try {
    return lexer.analyze(formula)
  } catch (error) {
    if (error instanceof LexerError) {
      const location = error.location
      console.log(formula)
      console.log(
        ' '.repeat(location.start) +
          '^'.repeat(location.end - location.start) +
          `← error: ${error.message}`
      )
      return false
    }

    throw error
  }
}

const parseOrFalse = (formula: string, tokens: Token[]) => {
  try {
    return parser.parse(tokens)
  } catch (error) {
    if (error instanceof ParseError) {
      const location = error.location
      console.log(formula)
      console.log(
        ' '.repeat(location.start) +
          '^'.repeat(location.end - location.start) +
          `← error: ${error.message}`
      )
      return false
    }

    throw error
  }
}

const evaluateOrFalse = (formula: string, ast: AST) => {
  try {
    return evaluator.evaluate(ast)
  } catch (error) {
    if (error instanceof EvaluatorReferenceError) {
      const location = error.location
      console.log(formula)
      console.log(
        ' '.repeat(location.start) +
          '^'.repeat(location.end - location.start) +
          `← error: ${error.message}`
      )
      return false
    }

    throw error
  }
}

const input = () =>
  rl.question('-> ', (line) => {
    if (line === '.exit') {
      rl.close()
      return
    }

    const tokens = analyzeOrFalse(line)
    if (tokens !== false) {
      const ast = parseOrFalse(line, tokens)

      if (ast !== false) {
        const result = evaluateOrFalse(line, ast)

        if (result !== false) {
          console.log(`<- ${result}`)
        }
      }
    }

    input()
  })

console.log('To exit, press ^C again or ^D or type .exit')
input()
