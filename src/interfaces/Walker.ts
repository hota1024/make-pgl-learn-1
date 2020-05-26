/*
 * Walker interface.
 */
export interface IWalker<T> {
  /**
   * Returns current index.
   */
  index(): number

  /**
   * Returns current value.
   */
  current(): T

  /**
   * Forward index and returns value.
   */
  next(): T

  /**
   * Returns next value.
   */
  peek(): T | undefined

  /**
   * Returns whether finished walking.
   */
  isFinished(): boolean

  /**
   * Each values.
   *
   * @param callback Each callback.
   */
  each<R = void>(
    callback: (walker: { current: () => T }, end: (result: R) => void) => void
  ): R
}
