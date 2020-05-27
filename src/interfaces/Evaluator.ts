import { AST } from '../types'

/*
 * Evaluator interface.
 */
export interface IEvaluator {
  /**
   * Evaluate AST.
   *
   * @param ast AST.
   */
  evaluate(ast: AST): number
}
