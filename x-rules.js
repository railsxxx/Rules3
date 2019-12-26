


let rule = {
  pat1: '+ a a',
  pat2: '2a'
}

let rule2 = {
  pat1: '(+ (* a b) (* c b))',
  //pat2: '(a+c)b'
  pat2: '(* (+ a c) b)'
}

function Expression(arrExpression) {
  // constructor function for expressions
  const [head, first, ...rest] = arrExpression; 
  this.operator = head
  this.first = first
  this.rest = rest
}

let matchVar = {}

function applyMatch(strPattern) {
  console.log(matchVar)
  console.log(strPattern)
  let result = "";
  for (let i in strPattern) {
    //console.log(result)
    if (matchVar[strPattern[i]] === undefined)
      result = result.concat(strPattern[i])
    else
      result = result.concat(matchVar[strPattern[i]])
  }
  return result
}

function match(input, pattern) {
  let inputExpr = new Expr(input)
  let patternExpr = new Expr(pattern)
  // match by position
  let inputExprLen = inputExpr.length
  let patternExprLen = patternExpr.length
  // same length
  if (inputExprLen != patternExprLen) return false
  // match pattern variables
  for (let i = 0; i < inputExprLen; i++) {
    let inputItem = inputExpr[i]
    let patternItem = patternExpr[i]
    if (matchVar[patternItem] === undefined) {
      if (isLetter(patternItem))
        matchVar[patternItem] = inputItem
      else
        if (inputItem != patternItem)
          return false
    }
    else {
      if (inputItem != matchVar[patternItem])
        return false
    }
  }
  return true
}

function rewrite(input, rul) {
  console.log(input)
  // clear variable matches for every rule
  matchVar = {}
  if (match(input, rul.pat1)) return applyMatch(rul.pat2)
  //if (match(input, rul.pat2)) return applyMatch(rul.pat1)
  return input
}

function isLetter(str) {
  return str.length === 1 && str.match(/[a-zA-Z]/i);
}