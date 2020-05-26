import { IParser, ILocation } from '../interfaces'
import {
  AST,
  Token,
  NumberNode,
  UnaryOperatorType,
  UnaryOperatorNode,
  BinaryOperatorNode,
  BinaryOperatorType,
} from '../types'
import { Walker } from './Walker'
import { Lexer } from './Lexer'

/*
 * TokenWalker type.
 */
export type TokenWalker = Walker<Token>

/*
 * Parser class.
 */
export class Parser implements IParser {
  parse(tokens: Token[]): AST {
    const walker = new Walker(tokens)

    return this.parseExpression(walker)
  }

  /**
   * Parse expression.
   *
   * @param tokens Tokens iterator.
   */
  private parseExpression(tokens: TokenWalker): AST {
    return this.parseExpression3(tokens)
  }

  /**
   * Parse expression(`a+b` and `a-b`).
   * @param tokens Tokens.
   */
  private parseExpression3(tokens: TokenWalker) {
    let expression = this.parseExpression2(tokens)

    while (true as const) {
      const peekToken = tokens.peek()

      if (!peekToken) {
        return expression
      }

      if (
        peekToken.type === 'symbol' &&
        (peekToken.symbol === 'plus' || peekToken.symbol === 'minus')
      ) {
        tokens.next()
        const operator: BinaryOperatorType =
          peekToken.symbol === 'plus' ? 'addition' : 'subtraction'

        const right = this.parseExpression2(tokens)
        console.log(`${operator}`, right)

        expression = this.makeBinaryOperator(
          operator,
          expression,
          right,
          expression.location.merge(right.location)
        )
      } else {
        return expression
      }
    }
  }

  /**
   * Parse expression(`a*b` and `a/b`).
   * @param tokens Tokens.
   */
  private parseExpression2(tokens: TokenWalker) {
    let expression = this.parseExpression1(tokens)

    while (true as const) {
      const peekToken = tokens.peek()

      if (!peekToken) {
        return expression
      }

      if (
        peekToken.type === 'symbol' &&
        (peekToken.symbol === 'asterisk' || peekToken.symbol === 'slash')
      ) {
        tokens.next()
        const operator: BinaryOperatorType =
          peekToken.symbol === 'asterisk' ? 'multiplication' : 'division'

        const right = this.parseExpression1(tokens)
        console.log(`${operator}`, right)
        expression = this.makeBinaryOperator(
          operator,
          expression,
          right,
          expression.location.merge(right.location)
        )
      } else {
        return expression
      }
    }
  }

  private parseExpression1(tokens: TokenWalker) {
    const peekToken = tokens.peek()

    if (peekToken) {
      if (
        peekToken.type === 'symbol' &&
        (peekToken.symbol === 'plus' || peekToken.symbol == 'minus')
      ) {
        tokens.next()
        const operator: UnaryOperatorType = peekToken.symbol
        const expression = this.parseAtom(tokens)

        return this.makeUnaryOperator(
          operator,
          expression,
          peekToken.location.merge(expression.location)
        )
      } else {
        return this.parseAtom(tokens)
      }
    } else {
      throw new Error('Parse expression1 error.')
    }
  }

  private parseAtom(tokens: TokenWalker) {
    const token = tokens.next()
    console.log('atom:', token)

    if (token.type === 'number') {
      return this.makeNumber(token.value, token.location)
    } else if (token.type === 'symbol' && token.symbol === 'left_parenthesis') {
      const expression = this.parseExpression(tokens)

      const nextToken = tokens.next()
      if (
        nextToken.type === 'symbol' &&
        nextToken.symbol === 'right_parenthesis'
      ) {
        return expression
      } else {
        throw new Error('Unclosed open parenthesis.')
      }
    }
  }

  /**
   * Make a Number.
   *
   * @param value Number value.
   * @param location Node location.
   */
  private makeNumber(value: number, location: ILocation): NumberNode {
    return {
      type: 'number',
      value,
      location,
    }
  }

  /**
   * Make a UnaryOperator.
   *
   * @param operator Operator type.
   * @param node Target AST node.
   * @param location Node location.
   */
  private makeUnaryOperator(
    operator: UnaryOperatorType,
    node: AST,
    location: ILocation
  ): UnaryOperatorNode {
    return {
      type: 'unary_operator',
      operator,
      node,
      location,
    }
  }

  /**
   * Make a BinaryOperator.
   *
   * @param operator Operator type.
   * @param left Left side AST node.
   * @param right Right side AST node.
   * @param location Node location.
   */
  private makeBinaryOperator(
    operator: BinaryOperatorType,
    left: AST,
    right: AST,
    location: ILocation
  ): BinaryOperatorNode {
    return {
      type: 'binary_operator',
      operator,
      left,
      right,
      location,
    }
  }
}
