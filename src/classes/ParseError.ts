import { ILocation } from '../interfaces'

/*
 * ParseError class.
 */
export class ParseError extends Error {
  name: 'ParseError'

  /**
   * Location.
   */
  location: ILocation

  constructor(message: string, location: ILocation) {
    super(message)
    this.location = location
  }
}
