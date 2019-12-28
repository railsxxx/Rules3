//http://craftinginterpreters.com/evaluating-expressions.html

// Interpreter ###############################################
function Interpreter() {
  const self = this;
  const environment = {};
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
  // visitor functions #######################################
  this.visitLiteralExpr = function(expr) {
    return expr.value;
  }
  this.visitGroupingExpr = function(expr) {
    return evaluate(expr.expression);
  }
  this.visitUnaryExpr = function(expr) {
    let right = evaluate(expr.right);
    switch (expr.operator.type) {
      case "BANG":
        return !isTruthy(right);
      case "MINUS":
        checkNumberOperand(expr.operator, right);
        return -right;
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
        checkNumberOperands(expr.operator, left, right);
        return left - right;
      case "PLUS":
        checkNumberOperands(expr.operator, left, right);
        return left + right;
        //return evalPLUS.apply(this, args);
      case "SLASH":
        checkNumberOperands(expr.operator, left, right);
        return left / right;
      case "STAR":
        checkNumberOperands(expr.operator, left, right);
        return left * right;
      case "PLUS": return String(left + right);
      case "BANG_EQUAL": return !isEqual(left, right);
      case "EQUAL_EQUAL": return isEqual(left, right);
    }
    // Unreachable.                                
    return null;
  }
  this.visitVariableExpr = function(expr) {
    environment[expr.name.lexeme] = 2;
    return environment[expr.name.lexeme];
  }
  // visitor functions utilities ############################
  function evalPLUS(operator, ...operands) {
    let sum = 0;
    let symbols = [];
    for (let i = 0; i < operands.length; i++) {
      if (typeof operand[i] == "number")
        sum += operands[i];
      else
        symbols.push(operands[i]);
    }
    return [new Literal(sum)].concat(symbols);
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