import { ILexer, ILocation } from '../interfaces'
import { Token, SymbolToken, NumberToken, IdentifierToken } from '../types'
import { Location } from './Location'
import { LexerError } from './LexerError'

/*
 * Lexer class.
 */
export class Lexer implements ILexer {
  analyze(source: string): Token[] {
    const tokens: Token[] = []
    let pos = 0

    const match = (...expects: string[]) => {
      for (const expect of expects) {
        let match = true

        for (let i = 0; i < expect.length; ++i) {
          if (expect[i] !== source[pos + i]) {
            match = false
            break
          }
        }

        if (match) {
          return expect
        }
      }

      return false
    }

    while (pos < source.length) {
      if (/[0-9]|\./.test(source[pos])) {
        const start = pos
        let useDecimal = false

        while (pos < source.length && /[0-9]|\./.test(source[pos])) {
          if (source[pos] === '.') {
            if (useDecimal) {
              throw new LexerError(
                `decimal point is already used`,
                new Location(pos, pos + 1)
              )
            } else {
              useDecimal = true
            }
          }
          ++pos
        }

        tokens.push(
          this.makeNumber(
            Number(source.slice(start, pos)),
            new Location(start, pos)
          )
        )
      } else if (/[a-zA-Z]|_/.test(source[pos])) {
        const start = pos

        while (pos < source.length && /[a-zA-Z0-9]|_/.test(source[pos])) {
          ++pos
        }

        tokens.push(
          this.makeIdentifier(
            source.slice(start, pos),
            new Location(start, pos)
          )
        )
      } else {
        const symbol = match(
          '+=',
          '-=',
          '*=',
          '/=',
          '%=',
          '==',
          '!=',
          '<=',
          '>='
        )
        if (symbol) {
          const map: {
            [K: string]: SymbolToken['symbol']
          } = {
            '+=': 'plus_equal',
            '-=': 'minus_equal',
            '*=': 'asterisk_equal',
            '/=': 'slash_equal',
            '%=': 'percent_equal',
            '==': 'equal_equal',
            '!=': 'exclamation_equal',
            '<=': 'less_equal_than',
            '>=': 'greeter_equal_than',
          }

          tokens.push(
            this.makeSymbol(map[symbol], new Location(pos, symbol.length))
          )

          pos += symbol.length
        } else if ('+-*/%!(),;=<>'.includes(source[pos])) {
          const map: {
            [K: string]: SymbolToken['symbol']
          } = {
            '+': 'plus',
            '-': 'minus',
            '*': 'asterisk',
            '/': 'slash',
            '%': 'percent',
            '!': 'exclamation',
            '(': 'left_parenthesis',
            ')': 'right_parenthesis',
            ',': 'comma',
            ';': 'semicolon',
            '=': 'equal',
            '<': 'less_than',
            '>': 'greeter_than',
          }

          tokens.push(
            this.makeSymbol(map[source[pos]], new Location(pos, pos + 1))
          )
          ++pos
        } else if (source[pos] === ' ') {
          while (source[pos] === ' ') {
            ++pos
          }
        } else {
          throw new LexerError('illegal character', new Location(pos, pos + 1))
        }
      }
    }

    return tokens
  }

  /**
   * Make a NumberToken.
   *
   * @param value Value.
   * @param location Token location.
   */
  private makeNumber(value: number, location: ILocation): NumberToken {
    return {
      type: 'number',
      value,
      location,
    }
  }

  /**
   * Make a SymbolToken.
   *
   * @param symbol Symbol type.
   * @param location Token location.
   */
  private makeSymbol(
    symbol: SymbolToken['symbol'],
    location: ILocation
  ): SymbolToken {
    return {
      type: 'symbol',
      symbol,
      location,
    }
  }

  /**
   * Make a IdentifierToken.
   *
   * @param identifier Identifier string.
   * @param location Token location.
   */
  private makeIdentifier(
    identifier: string,
    location: ILocation
  ): IdentifierToken {
    return {
      type: 'identifier',
      identifier,
      location,
    }
  }
}
