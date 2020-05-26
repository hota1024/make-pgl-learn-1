import { ILexer, ILocation } from '../interfaces'
import { Token, SymbolToken, NumberToken } from '../types'
import { Location } from './Location'

/*
 * Lexer class.
 */
export class Lexer implements ILexer {
  analyze(source: string): Token[] {
    const tokens: Token[] = []
    let pos = 0

    while (pos < source.length) {
      if (/[0-9]/.test(source[pos])) {
        const start = pos

        while (pos < source.length && /[0-9]/.test(source[pos])) {
          ++pos
        }

        tokens.push(
          this.makeNumber(
            Number(source.slice(start, pos)),
            new Location(start, pos)
          )
        )
      } else if ('+-*/()'.includes(source[pos])) {
        let symbol: SymbolToken['symbol']

        if (source[pos] === '+') {
          symbol = 'plus'
        } else if (source[pos] === '-') {
          symbol = 'minus'
        } else if (source[pos] === '*') {
          symbol = 'asterisk'
        } else if (source[pos] === '/') {
          symbol = 'slash'
        } else if (source[pos] === '(') {
          symbol = 'left_parenthesis'
        } else if (source[pos] === ')') {
          symbol = 'right_parenthesis'
        }

        tokens.push(this.makeSymbol(symbol, new Location(pos, pos + 1)))
        ++pos
      } else if (source[pos] === ' ') {
        while (source[pos] === ' ') {
          ++pos
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
  makeNumber(value: number, location: ILocation): NumberToken {
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
  makeSymbol(symbol: SymbolToken['symbol'], location: ILocation): SymbolToken {
    return {
      type: 'symbol',
      symbol,
      location,
    }
  }
}
