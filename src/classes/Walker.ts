import { IWalker } from '../interfaces'

/*
 * Walker class.
 */
export class Walker<T> implements IWalker<T> {
  /**
   * Index.
   */
  private mIndex = -1

  /**
   * Values array.
   */
  private mValues: T[] = []

  /**
   * Walker constructor.
   *
   * @param values Values array.
   */
  constructor(values: T[]) {
    this.mValues = values
  }

  index(): number {
    return this.mIndex
  }

  current(): T {
    return this.mValues[this.mIndex]
  }

  next(): T {
    ++this.mIndex
    return this.current()
  }

  peek(): T | undefined {
    return this.mValues[this.mIndex + 1]
  }

  isFinished(): boolean {
    return this.mIndex > this.mValues.length - 1
  }

  each<R>(
    callback: (walker: { current: () => T }, end: (result: R) => void) => void
  ): R {
    let isEnd = false
    let returnValue: R

    while (true as const) {
      if (this.isFinished()) {
        return returnValue
      }

      const end = (result: R) => {
        isEnd = true
        returnValue = result
        return
      }

      callback({ current: () => this.current() }, end)

      if (isEnd) return returnValue

      this.next()
    }
  }
}
