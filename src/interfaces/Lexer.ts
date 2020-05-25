import { Token } from '../types'

/*
 * Lexer interface.
 */
export interface ILexer {
  /**
   * Analyze code and returns tokens.
   *
   * @param source Source string.
   */
  analyze(source: string): Token[]
}
