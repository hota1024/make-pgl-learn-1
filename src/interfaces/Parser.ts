import { Token, AST } from '../types'

/*
 * Parser interface.
 */
export interface IParser {
  /**
   * Parse tokens and return AST.
   *
   * @param tokens Tokens.
   */
  parse(tokens: Token[]): AST
}
