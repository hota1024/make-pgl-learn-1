import { AST } from '../types'

/*
 * EvaluatorResult type.
 */
export type EvaluatorResult = number | string

/*
 * Evaluator interface.
 */
export interface IEvaluator {
  /**
   * Evaluate AST.
   *
   * @param ast AST.
   */
  evaluate(ast: AST): EvaluatorResult
}
