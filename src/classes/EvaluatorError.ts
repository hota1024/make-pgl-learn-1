import { ILocation } from '..'

/*
 * EvaluatorError.
 */
export class EvaluatorError extends Error {
  /**
   * Location.
   */
  location: ILocation

  constructor(message: string, location: ILocation) {
    super(message)
    this.location = location
  }
}
