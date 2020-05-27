import { Lexer } from '../src/classes'

describe('Lexer class test', () => {
  test('should analyze code and return tokens', () => {
    const lexer = new Lexer()
    const source = '3 * (4 + 2)'
    const tokens = lexer.analyze(source)

    expect(tokens[0].type).toBe('number')
    expect(tokens[0].type === 'number' && tokens[0].value).toBe(3)
    expect(tokens[0].location).toEqual({ start: 0, end: 1 })

    expect(tokens[1].type).toBe('symbol')
    expect(tokens[1].type === 'symbol' && tokens[1].symbol).toBe('asterisk')
    expect(tokens[1].location).toEqual({ start: 2, end: 3 })

    expect(tokens[2].type).toBe('symbol')
    expect(tokens[2].type === 'symbol' && tokens[2].symbol).toBe(
      'left_parenthesis'
    )
    expect(tokens[2].location).toEqual({ start: 4, end: 5 })

    expect(tokens[3].type).toBe('number')
    expect(tokens[3].type === 'number' && tokens[3].value).toBe(4)
    expect(tokens[3].location).toEqual({ start: 5, end: 6 })

    expect(tokens[4].type).toBe('symbol')
    expect(tokens[4].type === 'symbol' && tokens[4].symbol).toBe('plus')
    expect(tokens[4].location).toEqual({ start: 7, end: 8 })

    expect(tokens[5].type).toBe('number')
    expect(tokens[5].type === 'number' && tokens[5].value).toBe(2)
    expect(tokens[5].location).toEqual({ start: 9, end: 10 })
  })

  test('should analyze identifiers', () => {
    const lexer = new Lexer()
    const source = 'hoge fuga hota1024'
    const tokens = lexer.analyze(source)

    expect(tokens[0].type).toBe('identifier')
    expect(tokens[0].type === 'identifier' && tokens[0].identifier).toBe('hoge')

    expect(tokens[1].type).toBe('identifier')
    expect(tokens[1].type === 'identifier' && tokens[1].identifier).toBe('fuga')

    expect(tokens[2].type).toBe('identifier')
    expect(tokens[2].type === 'identifier' && tokens[2].identifier).toBe(
      'hota1024'
    )
  })

  test('should analyze function call', () => {
    const lexer = new Lexer()
    const source = 'pow(2, 3)' // 2^3
    const tokens = lexer.analyze(source)

    expect(tokens[0].type).toBe('identifier')
    expect(tokens[0].type === 'identifier' && tokens[0].identifier).toBe('pow')

    expect(tokens[1].type).toBe('symbol')
    expect(tokens[1].type === 'symbol' && tokens[1].symbol).toBe(
      'left_parenthesis'
    )

    expect(tokens[2].type).toBe('number')
    expect(tokens[2].type === 'number' && tokens[2].value).toBe(2)

    expect(tokens[3].type).toBe('symbol')
    expect(tokens[3].type === 'symbol' && tokens[3].symbol).toBe('comma')

    expect(tokens[4].type).toBe('number')
    expect(tokens[4].type === 'number' && tokens[4].value).toBe(3)

    expect(tokens[5].type).toBe('symbol')
    expect(tokens[5].type === 'symbol' && tokens[5].symbol).toBe(
      'right_parenthesis'
    )
  })
})
