import { IEvaluator, EvaluatorResult } from '../interfaces'
import { AST } from '../types'
import { EvaluatorReferenceError } from '.'
import { EvaluatorSyntaxError } from './EvaluatorSyntaxError'
import { EvaluatorTypeError } from './EvaluatorTypeError'

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
    true: 1,
    false: 0,
  }

  /**
   * Variables.
   */
  readonly variables = {}

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

  evaluate(ast: AST): EvaluatorResult {
    return this.evaluateAST(ast)
  }

  /**
   * Evaluate AST.
   *
   * @param ast AST.
   */
  private evaluateAST(ast: AST): EvaluatorResult {
    if (ast.type === 'binary_operator') {
      if (ast.operator === 'equal') {
        if (ast.left.type === 'identifier') {
          if (typeof this.constants[ast.left.identifier] !== 'undefined') {
            throw new EvaluatorTypeError(
              'invalid asssignment to constant',
              ast.left.location
            )
          }

          return (this.variables[ast.left.identifier] = this.evaluateAST(
            ast.right
          ))
        } else {
          throw new EvaluatorSyntaxError(
            'expected expression',
            ast.left.location
          )
        }
      } else if (
        ast.operator === 'addition_equal' ||
        ast.operator === 'subtraction_equal' ||
        ast.operator === 'multiplication_equal' ||
        ast.operator === 'division_equal' ||
        ast.operator === 'percent_equal'
      ) {
        if (ast.left.type === 'identifier') {
          if (typeof this.constants[ast.left.identifier] !== 'undefined') {
            throw new EvaluatorTypeError(
              'invalid asssignment to constant',
              ast.left.location
            )
          }

          if (typeof this.variables[ast.left.identifier] === 'undefined') {
            throw new EvaluatorReferenceError(
              `${ast.left.identifier} is not defined`,
              ast.left.location
            )
          }

          let calculator: (a, b) => number

          if (ast.operator === 'addition_equal') {
            calculator = (a, b) => a + b
          } else if (ast.operator === 'subtraction_equal') {
            calculator = (a, b) => a - b
          } else if (ast.operator === 'multiplication_equal') {
            calculator = (a, b) => a * b
          } else if (ast.operator === 'division_equal') {
            calculator = (a, b) => a / b
          } else if (ast.operator === 'percent_equal') {
            calculator = (a, b) => a % b
          }

          return (this.variables[ast.left.identifier] = calculator(
            this.variables[ast.left.identifier],
            this.evaluateAST(ast.right)
          ))
        } else {
          throw new EvaluatorSyntaxError(
            'expected expression',
            ast.left.location
          )
        }
      } else {
        let calculator: (a, b) => number

        if (ast.operator === 'addition') {
          calculator = (a, b) => a + b
        } else if (ast.operator === 'subtraction') {
          calculator = (a, b) => a - b
        } else if (ast.operator === 'multiplication') {
          calculator = (a, b) => a * b
        } else if (ast.operator === 'division') {
          calculator = (a, b) => a / b
        } else if (ast.operator === 'percent') {
          calculator = (a, b) => a % b
        } else if (ast.operator === 'equal_equal') {
          calculator = (a, b) => (a == b ? 1 : 0)
        } else if (ast.operator === 'exclamation_equal') {
          calculator = (a, b) => (a != b ? 1 : 0)
        } else if (ast.operator === 'less_than') {
          calculator = (a, b) => (a < b ? 1 : 0)
        } else if (ast.operator === 'less_equal_than') {
          calculator = (a, b) => (a <= b ? 1 : 0)
        } else if (ast.operator === 'greeter_than') {
          calculator = (a, b) => (a > b ? 1 : 0)
        } else if (ast.operator === 'greeter_equal_than') {
          calculator = (a, b) => (a >= b ? 1 : 0)
        }

        return calculator(
          this.evaluateAST(ast.left),
          this.evaluateAST(ast.right)
        )
      }
    } else if (ast.type === 'unary_operator') {
      if (ast.operator === 'minus') {
        const result = this.evaluateAST(ast.node)
        if (typeof result !== 'number') {
          throw NaN
        }
        return result * -1
      } else if (ast.operator === 'plus') {
        return this.evaluateAST(ast.node)
      } else if (ast.operator === 'exclamation') {
        return this.evaluateAST(ast.node) ? 0 : 1
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
      const value =
        this.constants[ast.identifier] ?? this.variables[ast.identifier]

      if (typeof value === 'undefined') {
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
