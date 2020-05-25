import { ILexer } from '../interfaces'
import { Token, SymbolToken } from '../types'
import { TokenMaker } from './TokenMaker'
import { Location } from './Location'

/*
 * Lexer class.
 */
export class Lexer implements ILexer {
  analyze(source: string): Token[] {
    const tokenMaker = new TokenMaker()
    const tokens: Token[] = []
    let pos = 0

    while (pos < source.length) {
      if (/[0-9]/.test(source[pos])) {
        const start = pos

        while (pos < source.length && /[0-9]/.test(source[pos])) {
          ++pos
        }

        tokens.push(
          tokenMaker.number(
            Number(source.slice(start, pos)),
            new Location(start, pos - 1)
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

        tokens.push(tokenMaker.symbol(symbol, new Location(pos, pos)))
        ++pos
      } else if (source[pos] === ' ') {
        while (source[pos] === ' ') {
          ++pos
        }
      }
    }

    return tokens
  }
}
