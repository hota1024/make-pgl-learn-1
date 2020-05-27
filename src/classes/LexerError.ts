import { ILocation } from '../interfaces'

/*
 * LexerError class.
 */
export class LexerError extends Error {
  name: 'LexerError'

  /**
   * Location.
   */
  location: ILocation

  constructor(message: string, location: ILocation) {
    super(message)
    this.location = location
  }
}
