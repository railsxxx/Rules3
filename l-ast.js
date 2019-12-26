//http://craftinginterpreters.com/representing-code.html

// Expression types ###########################################
// Literal ####################################################
function Literal(value) {
  this.value = value;
}
Literal.prototype.accept = function(operation) {
  return operation.visitLiteralExpr(this);
}
// Unary ######################################################
function Unary(operator, right) {
  this.operator = operator;
  this.right = right;
}
Unary.prototype.accept = function(operation) {
  return operation.visitUnaryExpr(this);
}
// Binary #####################################################
function Binary(left, operator, right) {
  this.left = left;           // Expression
  this.operator = operator;   // Token
  this.right = right;         // Expression
}
Binary.prototype.accept = function(operation) {
  return operation.visitBinaryExpr(this);
}
// Grouping ###################################################
function Grouping(expression) {
  this.expression = expression;
}
Grouping.prototype.accept = function(operation) {
  return operation.visitGroupingExpr(this);
}
// Variable ###################################################
function Variable(name) {
  this.name = name;
}
Variable.prototype.accept = function(operation) {
  return operation.visitVariableExpr(this);
}

// Expression visitors ########################################
// ASTPrinter #################################################
function AstPrinter() {
  const self = this;
  function parenthesize(name, ...exprs) {
    let res = "(" + name;
    for (expr of exprs) {
      res += " " + expr.accept(self);
    }
    res += ")";
    return res;
  }
  this.print = function(expr) {
    return expr.accept(self);
  }
  this.visitLiteralExpr = function(expr) {
    return expr.value;
  }
  this.visitUnaryExpr = function(expr) {
    return parenthesize(expr.operator.lexeme, expr.right);
  }
  this.visitBinaryExpr = function(expr) {
    return parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }
  this.visitGroupingExpr = function(expr) {
    return parenthesize("group", expr.expression);
  }
  this.visitVariableExpr = function(expr) {
    return expr.name.lexeme;
  }
}

// AstTest ####################################################
const sc = require("./l-scanner.js");
const Token = sc.token;

function AstTest() {
  const expression = new Binary(
    new Unary(
      new Token("MINUS", "-", null, 1),
      new Literal(123)
    ),
    new Token("PLUS", "+", null, 1),
    new Grouping(
      new Literal(45.67)
    )
  );
  const printer = new AstPrinter();
  console.log(printer.print(expression));
}
// exports ####################################################
exports.astTest = AstTest;
exports.astPrinter = AstPrinter;
exports.binary = Binary;
exports.unary = Unary;
exports.literal = Literal;
exports.grouping = Grouping;
exports.variable = Variable;
