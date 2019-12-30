//http://craftinginterpreters.com/parsing-expressions.html

const sc = require("./l-scanner.js")
const Scanner = sc.scanner;
//const Token = sc.token;

const ast = require("./l-ast.js")
const Binary = ast.binary;
const Literal = ast.literal;
const Unary = ast.unary;
const Grouping = ast.grouping;
const Variable = ast.variable;
const AstPrinter = ast.astPrinter


// Parser ############################################## 
function Parser(arrTokens) {
  let tokens = arrTokens;
  let current = 0;
  let expr = parse();
  return expr;
  //}

  // let tokens = [];
  // let current = 0;

  function parse() {
    try {
      return expression();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // parser rules ########################################
  function expression() {
    return equality();
  }
  function equality() {
    let expr = comparison();

    let operator = null;
    let right = null;
    while (match("BANG_EQUAL", "EQUAL_EQUAL")) {
      operator = previous();
      right = comparison();
      expr = new Binary(operator, expr, right);
    }
    return expr;
  }
  function comparison() {
    let expr = addition();

    let operator = null;
    let right = null;
    while (match("GREATER", "GREATER_EQUAL", "LESS", "LESS_EQUAL")) {
      operator = previous();
      right = addition();
      expr = new Binary(operator, expr, right);
    }
    return expr;
  }

  function addition() {
    let expr = multiplication();
    return matchType(expr, multiplication, "MINUS", "PLUS");
  }

  function multiplication() {
    let expr = unary();

    // let operator = null;
    // let right = null;
    // while (match("SLASH", "STAR")) {
    //   operator = previous();
    //   right = unary();
    //   expr = new Binary(operator, expr, right);
    // }
    // return expr;
    return matchType(expr, unary, "SLASH", "STAR");
  }
  function unary() {
    if (match("BANG", "MINUS")) {
      let operator = previous();
      let right = unary();
      return new Unary(operator, right);
    }
    return primary();
  }
  function primary() {
    if (match("FALSE")) return new Literal(false);
    if (match("TRUE")) return new Literal(true);
    if (match("NIL")) return new Literal(null);

    if (match("NUMBER", "STRING")) {
      return new Literal(previous().literal);
    }

    if (match("LEFT_PAREN")) {
      let expr = expression();
      consume("RIGHT_PAREN", "Expect ')' after expression.");
      return new Grouping(expr);
    }

    if (match("IDENTIFIER")) {
      let name = previous();
      return new Variable(name);
    }

    throw error(peek(), "Expect expression.");
  }
  // parser utilites #####################################
  function matchType(expr, operation, ...types) {
    let operator = null;
    let ops;
    while (match.apply(null, types)) {
      if (!operator) {
        operator = previous();
        ops = [null, operator, expr];
        ops.push(operation());
      }
      else {
        if (operator.type == previous().type)
          ops.push(operation());
        else {
          expr = new (Function.prototype.bind.apply(Binary, ops));
          operator = previous();
          ops = [null, operator, expr];
          ops.push(operation());
        }
      }
    }
    if (operator)
      return new (Function.prototype.bind.apply(Binary, ops));
    return expr;
  }
  function match(...types) {
    for (type of types) {
      if (check(type)) {
        advance();
        return true;
      }
    }
    return false;
  }
  function check(type) {
    if (isAtEnd()) return false;
    return peek().type == type;
  }
  function advance() {
    if (!isAtEnd()) current++;
    return previous();
  }
  function peek() {
    return tokens[current];
  }
  function previous() {
    return tokens[current - 1];
  }
  function isAtEnd() {
    return peek().type == "EOF";
  }
  function consume(type, message) {
    if (check(type)) return advance();
    throw error(peek(), message);
  }
}
// panic mode ############################################
function error(token, message) {
  //Lox.error(token, message);     
  loxError(token, message);
  return new ParseError();
}
function loxError(token, message) {
  if (token.type == "EOF") {
    // report(token.line, " at end", message);
    console.log(token.line + ": at end: " + message);
  } else {
    // report(token.line, " at '" + token.lexeme + "'", message);
    console.log(token.line + ": at '" + token.lexeme + "': " + message);
  }
}
function ParseError() {

}
// ParserTest #############################################
function ParserTest() {
  let source = '1+2+3+4-5-6-7';
  // let source = '1*2*3*4/5/6/7';
  //let source = '1<2<3<4>5>6>7'
  console.log(source);

  let tokens = Scanner(source);
  // console.log(tokens);

  let expression = Parser(tokens);
  if (!expression) return;

  const printer = new AstPrinter();
  console.log(printer.print(expression));
}
// exports ################################################
exports.parser = Parser;
exports.parserTest = ParserTest;
