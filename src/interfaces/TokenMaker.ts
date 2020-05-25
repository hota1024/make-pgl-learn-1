import { ILocation } from './Location'
import { NumberToken, SymbolToken } from '../types/Token'

/*
 * TokenMaker interface.
 */
export interface ITokenMaker {
  /**
   * Make a NumberToken.
   *
   * @param value Number value.
   * @param location Token location.
   */
  number(value: number, location: ILocation): NumberToken

  /**
   * Make a SymbolToken.
   *
   * @param symbol Symbol type.
   * @param location Token location.
   */
  symbol(symbol: SymbolToken['symbol'], location: ILocation): SymbolToken
}
