import { ILocation } from '../interfaces'

/*
 * Location class.
 */
export class Location implements ILocation {
  start: number

  end: number

  /**
   * Location constructor.
   *
   * @param start Start.
   * @param end End.
   */
  constructor(start: number, end: number) {
    this.start = start
    this.end = end
  }

  merge(location: ILocation): Location {
    return new Location(
      Math.min(this.start, location.start),
      Math.max(this.end, location.end)
    )
  }
}
