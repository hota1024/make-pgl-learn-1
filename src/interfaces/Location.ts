/*
 * Location interface.
 */
export interface ILocation {
  /**
   * Start.
   */
  start: number

  /**
   * End.
   */
  end: number

  /**
   * Merge.
   *
   * @param location Location.
   */
  merge(location: ILocation): ILocation
}
