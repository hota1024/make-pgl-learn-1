import { Lexer, Parser, Evaluator } from '../src/classes'

describe('Eavluator class test', () => {
  test('should evaluate', () => {
    const lexer = new Lexer()
    const tokens = lexer.analyze('4 + 29 - 32 * 43 / (1 + 3)')

    const parser = new Parser()
    const ast = parser.parse(tokens)

    const evaluator = new Evaluator()
    const result = evaluator.evaluate(ast)

    expect(result).toBe(-311)
  })
})
