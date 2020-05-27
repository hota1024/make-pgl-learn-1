import { ILocation } from '../interfaces'

/*
 * EvaluatorReferenceError class.
 */
export class EvaluatorReferenceError extends Error {
  name = 'EvaluatorReferenceError'

  /**
   * Location.
   */
  location: ILocation

  constructor(message: string, location: ILocation) {
    super(message)
    this.location = location
  }
}
