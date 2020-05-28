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
    | 'percent'
    | 'exclamation'
    | 'left_parenthesis'
    | 'right_parenthesis'
    | 'comma'
    | 'semicolon'
    | 'equal'
    | 'plus_equal'
    | 'minus_equal'
    | 'asterisk_equal'
    | 'slash_equal'
    | 'percent_equal'
    | 'equal_equal'
    | 'exclamation_equal'
    | 'less_than'
    | 'less_equal_than'
    | 'greeter_than'
    | 'greeter_equal_than'
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
