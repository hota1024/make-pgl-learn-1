import { IParser, ILocation } from '../interfaces'
import {
  AST,
  Token,
  NumberNode,
  UnaryOperatorType,
  UnaryOperatorNode,
  BinaryOperatorNode,
  BinaryOperatorType,
  CallNode,
  IdentifierNode,
} from '../types'
import { Walker } from './Walker'
import { ParseError } from './ParseError'
import { Location } from './Location'

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
    return this.parseExpression5(tokens)
  }

  /**
   * Parse expression(`a=b`, `a+=b`, `a-=b`, `a*=b`, `a/=b`, `a%=b`).
   *
   * @param tokens Tokens.
   */
  private parseExpression5(tokens: TokenWalker) {
    let expression = this.parseExpression4(tokens)

    while (true as const) {
      const peekToken = tokens.peek()

      if (!peekToken) {
        return expression
      }

      if (peekToken.type === 'symbol' && peekToken.symbol === 'equal') {
        tokens.next()
        const right = this.parseExpression5(tokens)

        expression = this.makeBinaryOperator(
          'equal',
          expression,
          right,
          expression.location.merge(right.location)
        )
      } else if (
        peekToken.type === 'symbol' &&
        peekToken.symbol === 'plus_equal'
      ) {
        tokens.next()
        const right = this.parseExpression5(tokens)

        expression = this.makeBinaryOperator(
          'addition_equal',
          expression,
          right,
          expression.location.merge(right.location)
        )
      } else if (
        peekToken.type === 'symbol' &&
        peekToken.symbol === 'minus_equal'
      ) {
        tokens.next()
        const right = this.parseExpression5(tokens)

        expression = this.makeBinaryOperator(
          'subtraction_equal',
          expression,
          right,
          expression.location.merge(right.location)
        )
      } else if (
        peekToken.type === 'symbol' &&
        peekToken.symbol === 'asterisk_equal'
      ) {
        tokens.next()
        const right = this.parseExpression5(tokens)

        expression = this.makeBinaryOperator(
          'multiplication_equal',
          expression,
          right,
          expression.location.merge(right.location)
        )
      } else if (
        peekToken.type === 'symbol' &&
        peekToken.symbol === 'slash_equal'
      ) {
        tokens.next()
        const right = this.parseExpression5(tokens)

        expression = this.makeBinaryOperator(
          'division_equal',
          expression,
          right,
          expression.location.merge(right.location)
        )
      } else if (
        peekToken.type === 'symbol' &&
        peekToken.symbol === 'percent_equal'
      ) {
        tokens.next()
        const right = this.parseExpression5(tokens)

        expression = this.makeBinaryOperator(
          'percent_equal',
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
   * Parse expression(`a==b`, `a!=b`, `a<b`, `a<=b`, `a>b`, `a>=b`).
   * @param tokens Tokens.
   */
  private parseExpression4(tokens: TokenWalker) {
    let expression = this.parseExpression3(tokens)

    while (true as const) {
      const peekToken = tokens.peek()

      if (!peekToken) {
        return expression
      }

      if (
        peekToken.type === 'symbol' &&
        (peekToken.symbol === 'equal_equal' ||
          peekToken.symbol === 'exclamation_equal' ||
          peekToken.symbol === 'less_than' ||
          peekToken.symbol === 'less_equal_than' ||
          peekToken.symbol === 'greeter_than' ||
          peekToken.symbol === 'greeter_equal_than')
      ) {
        tokens.next()
        const operator: BinaryOperatorType = peekToken.symbol

        const right = this.parseExpression5(tokens)

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
   * Parse expression(`a%b`, `a+b` and `a-b`).
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
        (peekToken.symbol === 'percent' ||
          peekToken.symbol === 'plus' ||
          peekToken.symbol === 'minus')
      ) {
        tokens.next()
        const operator: BinaryOperatorType =
          peekToken.symbol === 'plus'
            ? 'addition'
            : peekToken.symbol === 'minus'
            ? 'subtraction'
            : 'percent'

        const right = this.parseExpression2(tokens)

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
        (peekToken.symbol === 'plus' ||
          peekToken.symbol == 'minus' ||
          peekToken.symbol === 'exclamation')
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
      throw new ParseError(
        'peek error',
        new Location(
          tokens.current().location.start + 1,
          tokens.current().location.end + 1
        )
      )
    }
  }

  private parseAtom(tokens: TokenWalker) {
    const token = tokens.next()

    if (token.type === 'number') {
      return this.makeNumber(token.value, token.location)
    } else if (token.type === 'identifier') {
      const identifierToken = token

      const peekToken = tokens.peek()

      if (
        peekToken &&
        peekToken.type === 'symbol' &&
        peekToken.symbol === 'left_parenthesis'
      ) {
        const args: AST[] = []
        tokens.next()

        while (true as const) {
          const token = tokens.peek()

          if (!token) {
            throw new ParseError('peek error', tokens.current().location)
          } else if (token.type === 'symbol') {
            if (token.symbol === 'right_parenthesis') {
              tokens.next()
              return this.makeCall(
                identifierToken.identifier,
                args,
                identifierToken.location.merge(token.location)
              )
            } else if (token.symbol === 'comma') {
              tokens.next()
            } else {
              throw new ParseError(
                `invalid character: ${token.symbol}`,
                token.location
              )
            }
          }

          const arg = this.parseExpression(tokens)
          if (arg) {
            args.push(arg)
          }
        }
      } else {
        return this.makeIdentifier(
          identifierToken.identifier,
          identifierToken.location
        )
      }
    } else if (token.type === 'symbol' && token.symbol === 'left_parenthesis') {
      const expression = this.parseExpression(tokens)

      const nextToken = tokens.next()
      if (
        nextToken &&
        nextToken.type === 'symbol' &&
        nextToken.symbol === 'right_parenthesis'
      ) {
        return expression
      } else {
        throw new ParseError('missing ) in parenthetical.', token.location)
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

  /**
   * Make a IdentifierNode.
   *
   * @param identifier Identifier string.
   * @param location Node location.
   */
  private makeIdentifier(
    identifier: string,
    location: ILocation
  ): IdentifierNode {
    return {
      type: 'identifier',
      identifier,
      location,
    }
  }

  /**
   * Make a CallNode.
   *
   * @param identifier Identifier string.
   * @param args Argument AST nodes.
   * @param location Node location.
   */
  private makeCall(
    identifier: string,
    args: AST[],
    location: ILocation
  ): CallNode {
    return {
      type: 'call',
      identifier,
      args,
      location,
    }
  }
}
