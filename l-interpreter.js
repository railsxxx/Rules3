//http://craftinginterpreters.com/evaluating-expressions.html

const ast = require("./l-ast.js")
const Binary = ast.binary;
const Literal = ast.literal;
const Unary = ast.unary;
const Grouping = ast.grouping;
const Variable = ast.variable;

const sc = require("./l-scanner.js")
//const Scanner = sc.scanner;
const Token = sc.token;

// Interpreter ###############################################
function Interpreter() {
  const self = this;
  const environment = {};
  this.interpret = function(expression) {
    try {
      let value = evaluate(expression);
      return value;
    }
    catch (error) {
      console.log(error);
      return null;
    }
  }
  function evaluate(expr) {
    return expr.accept(self);
  }
  function isTruthy(object) {
    if (object == null) return false;
    if (object == 0) return false;
    if (typeof (object) == "boolean") return object;
    return true;
  }
  function isEqual(left, right) {
    // nil is only equal to nil.               
    if (left == null && right == null) return true;
    if (left == null) return false;
    return left == right;
  }
  // visitor functions #######################################
  this.visitLiteralExpr = function(expr) {
    return expr.value;
  }
  this.visitGroupingExpr = function(expr) {
    return evaluate(expr.expression);
  }
  this.visitUnaryExpr = function(expr) {
    let operand = evaluate(expr.operand);
    switch (expr.operator.type) {
      case "BANG":
        return !isTruthy(operand);
      case "MINUS":
        checkNumberOperand(expr.operator, operand);
        return -operand;
    }
    // Unreachable.                              
    return null;
  }
  this.visitBinaryExpr = function(expr) {
    let left = evaluate(expr.operands[0]);
    let right = evaluate(expr.operands[1]);
    const args = [expr.operator].concat(expr.operands);
    switch (expr.operator.type) {
      case "GREATER":
        checkNumberOperands(expr.operator, left, right);
        return left > right;
      case "GREATER_EQUAL":
        checkNumberOperands(expr.operator, left, right);
        return left >= right;
      case "LESS":
        checkNumberOperands(expr.operator, left, right);
        return left < right;
      case "LESS_EQUAL":
        checkNumberOperands(expr.operator, left, right);
        return left <= right;
      case "MINUS":
        // checkNumberOperands(expr.operator, left, right);
        // return left - right;
        return evalOperation.apply(this,
          [(a, b) => a - b].concat(args));
      case "PLUS":
        // checkNumberOperands(expr.operator, left, right);
        // return left + right;
        return evalOperation.apply(this,
          [(a, b) => a + b].concat(args));
      case "SLASH":
        // checkNumberOperands(expr.operator, left, right);
        // return left / right;
        return evalOperation.apply(this,
          [(a, b) => a / b].concat(args));
      case "STAR":
        // checkNumberOperands(expr.operator, left, right);
        // return left * right;
        return evalOperation.apply(this,
          [(a, b) => a * b].concat(args));
      case "PLUS": return String(left + right);
      case "BANG_EQUAL": return !isEqual(left, right);
      case "EQUAL_EQUAL": return isEqual(left, right);
    }
    // Unreachable.                                
    return null;
  }
  this.visitVariableExpr = function(expr) {
    //environment[expr.name.lexeme] = 2;
    return environment[expr.name.lexeme];
  }
  // visitor functions utilities ############################
  function evalOperation(operation, operator, ...operands) {
    let total, result;
    let symbols = [];
    for (let i = 0; i < operands.length; i++) {
      result = evaluate(operands[i]);
      if (typeof result == "number")
        if (typeof total == "undefined") total = result;  // init total
        else total = operation(total, result);            // update total
      else if (typeof result == "undefined" || result == null)
        symbols.push(operands[i]);
      else
        symbols.push(result);
      //console.log("result: " + result +", total: " + total );
    }
    if (symbols.length > 0) {
      let totalExpr, ops;
      if (typeof total == "number") {
        if (total < 0) {
          totalExpr = new Unary(new Token("MINUS", "-", null, 0), new Literal(-total));
        }
        else {
          totalExpr = new Literal(total);
        }
      }
      ops = [null, operator, totalExpr].concat(symbols);
      expr = new (Function.prototype.bind.apply(Binary, ops));
      //console.log(expr);
      return expr;
    }
    return total;
  }
}
// runtime error ############################################
function RuntimeError(operator, message) {
  this.operator = operator;
  this.message = message;
}

function checkNumberOperand(operator, right) {
  if (typeof right == "number")
    return;
  throw new RuntimeError(
    operator,
    "Operand must be a number: " + right);
}

function checkNumberOperands(operator, left, right) {
  if (typeof left == "number" && typeof right == "number")
    return;
  throw new RuntimeError(
    operator,
    "Operands must be numbers! left: " + left
    + ", right: " + right);
}

// exports ##################################################
exports.interpreter = Interpreter;