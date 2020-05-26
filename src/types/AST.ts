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
export type UnaryOperatorType = 'minus' | 'plus'

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
 * AST type.
 */
export type AST = NumberNode | UnaryOperatorNode | BinaryOperatorNode
