import { ILocation } from '../interfaces'

/*
 * ASTBase type.
 */
export type ASTBase = {
  /**
   * AST type.
   */
  type: string

  /**
   * AST location.
   */
  location: ILocation
}

/*
 * Number AST node.
 */
export type NumberNode = ASTBase & {
  type: 'number'

  /**
   * Number value.
   */
  value: number
}

/*
 * UnaryOperatorType.
 */
export type UnaryOperatorType = 'minus' | 'plus' | 'exclamation'

/*
 * UnaryOperator AST node.
 */
export type UnaryOperatorNode = ASTBase & {
  type: 'unary_operator'

  /**
   * Operator type.
   */
  operator: UnaryOperatorType

  /**
   * Target AST node.
   */
  node: AST
}

/*
 * BinaryOperatorType.
 */
export type BinaryOperatorType =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'percent'
  | 'equal'
  | 'addition_equal'
  | 'subtraction_equal'
  | 'multiplication_equal'
  | 'division_equal'
  | 'percent_equal'
  | 'equal_equal'
  | 'equal_equal'
  | 'exclamation_equal'
  | 'less_than'
  | 'less_equal_than'
  | 'greeter_than'
  | 'greeter_equal_than'

/*
 * BinaryOperator AST node.
 */
export type BinaryOperatorNode = ASTBase & {
  type: 'binary_operator'

  /**
   * Operator type.
   */
  operator: BinaryOperatorType

  /**
   * Left side AST node.
   */
  left: AST

  /**
   * Right side AST node.
   */
  right: AST
}

/*
 * Identifier AST node.
 */
export type IdentifierNode = ASTBase & {
  type: 'identifier'

  /**
   * Identifier string.
   */
  identifier: string
}

/*
 * Call AST node.
 */
export type CallNode = ASTBase & {
  type: 'call'

  /**
   * Identifier string.
   */
  identifier: string

  /**
   * Argument nodes.
   */
  args: AST[]
}

/*
 * AST type.
 */
export type AST =
  | NumberNode
  | UnaryOperatorNode
  | BinaryOperatorNode
  | IdentifierNode
  | CallNode
