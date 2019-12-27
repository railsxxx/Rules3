

function RuleMatcher(sourceExpr, rule) {
  matchRule(sourceExpr, rule.patternExpression);
}

let symbolsMatched = {};

function matchRule(sourceExpr, patternExpr) {
  console.log(sourceExpr.left.left.constructor.name);
  console.log(sourceExpr.left.left.value);
  console.log(sourceExpr);
  console.log(patternExpr);
}


// exports ##################################################
exports.rulematcher = RuleMatcher;