import { Parser, Lexer, Location } from '../src/classes'

describe('Parser class test', () => {
  const lexer = new Lexer()
  const parser = new Parser()

  test('should parse', () => {
    const tokens = lexer.analyze('3 * (2 + 1)')
    const ast = parser.parse(tokens)

    expect(ast).toEqual({
      type: 'binary_operator',
      operator: 'multiplication',
      left: {
        type: 'number',
        value: 3,
        location: new Location(0, 1),
      },
      right: {
        type: 'binary_operator',
        operator: 'addition',
        left: {
          type: 'number',
          value: 2,
          location: new Location(5, 6),
        },
        right: {
          type: 'number',
          value: 1,
          location: new Location(9, 10),
        },
        location: new Location(5, 10),
      },
      location: new Location(0, 10),
    })
  })
})
