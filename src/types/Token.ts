import { ILocation } from '../interfaces'

/*
 * TokenBase type.
 */
export type TokenBase = {
  /**
   * Token type.
   */
  type: string

  /**
   * Token location.
   */
  location: ILocation
}

/*
 * NumberToken type.
 */
export type NumberToken = TokenBase & {
  type: 'number'

  /**
   * Number value.
   */
  value: number
}

/*
 * SymbolToken type.
 */
export type SymbolToken = TokenBase & {
  type: 'symbol'

  /**
   * Symbol type.
   */
  symbol:
    | 'plus'
    | 'minus'
    | 'asterisk'
    | 'slash'
    | 'left_parenthesis'
    | 'right_parenthesis'
    | 'comma'
}

/*
 * IdentifierToken type.
 */
export type IdentifierToken = TokenBase & {
  type: 'identifier'

  /**
   * Identifier string.
   */
  identifier: string
}

/*
 * Token type.
 */
export type Token = NumberToken | SymbolToken | IdentifierToken
