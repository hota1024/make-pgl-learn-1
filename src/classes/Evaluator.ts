import { IEvaluator } from '../interfaces'
import { AST } from '../types'

/*
 * Evaluator class.
 */
export class Evaluator implements IEvaluator {
  evaluate(ast: AST): number {
    return this.evaluateAST(ast)
  }

  /**
   * Evaluate AST.
   *
   * @param ast AST.
   */
  private evaluateAST(ast: AST): number {
    if (ast.type === 'binary_operator') {
      let calculator: (a, b) => number

      if (ast.operator === 'addition') {
        calculator = (a, b) => a + b
      } else if (ast.operator === 'subtraction') {
        calculator = (a, b) => a - b
      } else if (ast.operator === 'multiplication') {
        calculator = (a, b) => a * b
      } else if (ast.operator === 'division') {
        calculator = (a, b) => a / b
      }

      return calculator(this.evaluateAST(ast.left), this.evaluateAST(ast.right))
    } else if (ast.type === 'unary_operator') {
      if (ast.operator === 'minus') {
        return this.evaluateAST(ast.node) * -1
      } else if (ast.operator === 'plus') {
        return this.evaluateAST(ast.node)
      }
    } else if (ast.type === 'number') {
      return ast.value
    }
  }
}
