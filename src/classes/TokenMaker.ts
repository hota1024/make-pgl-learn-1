import { ITokenMaker, ILocation } from '../interfaces'
import { NumberToken, SymbolToken } from '../types/Token'

/*
 * TokenMaker class.
 */
export class TokenMaker implements ITokenMaker {
  number(value: number, location: ILocation): NumberToken {
    return {
      type: 'number',
      value,
      location,
    }
  }

  symbol(symbol: SymbolToken['symbol'], location: ILocation): SymbolToken {
    return {
      type: 'symbol',
      symbol,
      location,
    }
  }
}
