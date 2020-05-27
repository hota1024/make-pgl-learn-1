import { IEvaluator } from '../interfaces'
import { AST } from '../types'
import { EvaluatorReferenceError } from '.'

/*
 * Evaluator class.
 */
export class Evaluator implements IEvaluator {
  /**
   * Constants.
   */
  readonly constants = {
    E: Math.E,
    LN2: Math.LN2,
    LN10: Math.LN10,
    LOG2E: Math.LOG2E,
    LOG10E: Math.LOG10E,
    PI: Math.PI,
    SQRT1_2: Math.SQRT1_2,
    SQRT2: Math.SQRT2,
  }

  /**
   * Functions.
   */
  readonly functions = {
    abs: Math.abs,
    acos: Math.acos,
    acosh: Math.acosh,
    asin: Math.asin,
    asinh: Math.asinh,
    atan: Math.atan,
    atanh: Math.atanh,
    atan2: Math.atan2,
    cbrt: Math.cbrt,
    ceil: Math.ceil,
    clz32: Math.clz32,
    cos: Math.cos,
    cosh: Math.cosh,
    exp: Math.exp,
    expm1: Math.expm1,
    floor: Math.floor,
    fround: Math.fround,
    hypot: Math.hypot,
    imul: Math.imul,
    log: Math.log,
    log1p: Math.log1p,
    log10: Math.log10,
    log2: Math.log2,
    max: Math.max,
    min: Math.min,
    pow: Math.pow,
    random: Math.random,
    round: Math.round,
    sign: Math.sign,
    sin: Math.sin,
    sinh: Math.sinh,
    sqrt: Math.sqrt,
    tan: Math.tan,
    tanh: Math.tanh,
    trunc: Math.trunc,
  }

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
    } else if (ast.type === 'call') {
      const func = this.functions[ast.identifier]

      if (!func) {
        throw new EvaluatorReferenceError(
          `${ast.identifier} is not defined.`,
          ast.location
        )
      } else {
        return func(...ast.args.map((arg) => this.evaluateAST(arg)))
      }
    } else if (ast.type === 'identifier') {
      const value = this.constants[ast.identifier]

      if (!value) {
        throw new EvaluatorReferenceError(
          `${ast.identifier} is not defined.`,
          ast.location
        )
      } else {
        return value
      }
    }
  }
}
