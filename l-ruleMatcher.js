

function RuleMatcher(sourceExpr, rule) {
  matchRule(sourceExpr, rule.patternExpression);
  return (new RewriteRule).rewrite(rule.rewriteExpression);
}

let symbolsMatched = {};

function matchRule(sourceExpr, patternExpr) {
  // console.log(sourceExpr);
  // console.log(patternExpr);
  symbolsMatched = {};
  (new MatchPattern()).match(sourceExpr, patternExpr);
  console.log(symbolsMatched);
}

function MatchPattern() {
  const self = this;
  let _sourceExpr;  // transmit sourceExpr from call to visitor function 
  // call visitor functions ###########################
  this.match = function(sourceExpr, patternExpr) {
    _sourceExpr = sourceExpr;
    return patternExpr.accept(self);
  }
  // visitor functions ################################
  this.visitLiteralExpr = function(patternExpr) {
    let sourceExpr = _sourceExpr;
    // check constructor
    if (sourceExpr.constructor.name != patternExpr.constructor.name) return false;
    // check value
    return patternExpr.value == sourceExpr.value;
  }
  this.visitUnaryExpr = function(patternExpr) {
    let sourceExpr = _sourceExpr;
    // check constructor
    if (sourceExpr.constructor.name != patternExpr.constructor.name) return false;
    // check operator
    if (sourceExpr.operator.type != patternExpr.operator.type) return false
    // check operands
    return this.match(sourceExpr.operand, patternExpr.operand);
  }
  this.visitBinaryExpr = function(patternExpr) {
    let sourceExpr = _sourceExpr;
    // check constructor
    if (sourceExpr.constructor.name != patternExpr.constructor.name) return false;
    // check operator
    if (sourceExpr.operator.type != patternExpr.operator.type) return false
    // check pattern operands
    let sourceOpIndex = 0;
    let sourceOpLength = sourceExpr.operands.length;
    for (patternOp of patternExpr.operands) {
      while (true) {
        if (sourceOpIndex < sourceOpLength) {
          let sourceOp = sourceExpr.operands[sourceOpIndex];
          sourceOpIndex++;
          if (this.match(sourceOp, patternOp))
            break; // next patternOp with next sourceOp
          // else same patternOp with next sourceOp
        }
        else {
          // no sourceOp for patternOp
          return false;
        }
      }
    }
    // sourceOps for all patternOps
    return true;
  }
  this.visitGroupingExpr = function(patternExpr) {
    let sourceExpr = _sourceExpr;
    // check constructor
    if (sourceExpr.constructor.name != patternExpr.constructor.name) return false;
    // check expressions
    return this.match(sourceExpr.expression, patternExpr.expression);
  }
  this.visitVariableExpr = function(patternExpr) {
    let sourceExpr = _sourceExpr;
    // stop recursive calls
    let value = symbolsMatched[patternExpr.name.lexeme]
    if (value == undefined) {
      symbolsMatched[patternExpr.name.lexeme] = sourceExpr;
      return true;
    }
    else {
      if (value == sourceExpr)
        return true;
      else
        return false;
    }
  }
}
function RewriteRule() {
  const self = this;
  // call visitor functions ##################################################
  this.rewrite = function(rewriteExpr) {
    // console.log("rewriteExpression");
    // console.log(rewriteExpr);
    return rewriteExpr.accept(self);
  }
  // visitor functions ##################################################
  this.visitLiteralExpr = function(expr) {
    return expr;
  }
  this.visitUnaryExpr = function(expr) {
    expr.operand = this.rewrite(expr.operand);
    return expr;
  }
  this.visitBinaryExpr = function(expr) {
    let operands = expr.operands;
    for (let i = 0; i < operands.length; i++) {
      operands[i] = this.rewrite(operands[i]);
    }
    return expr;
  }
  this.visitGroupingExpr = function(expr) {
    expr.expression = this.rewrite(expr.expression);
    return expr;
  }
  this.visitVariableExpr = function(expr) {
    // stop calls to rewrite
    let value = symbolsMatched[expr.name.lexeme]
    if (value == undefined) {
      throw "no value matched for symbol: " + expr.name.lexeme;
    }
    else return value;
  }
}

// exports ##################################################
exports.rulematcher = RuleMatcher;