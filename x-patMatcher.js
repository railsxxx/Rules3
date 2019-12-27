

function Patmatcher(expression, rule) {
  if (matchRule(expression, rule))
    return rewrite(rule);
}

let symbolsMatched = {};

function matchRule(expression, rule) {
  let patterns = rule.pattern;
  for (pattern of patterns) {
    if (matchPattern(expression, pattern))
      return true;
  }
  return false;
}
function matchPattern(expression, pattern) {
  // same length
  if (expression.length < pattern.length) return false;
  // match pattern variables
  symbolsMatched = {};
  let ec = -1;
  for (let pc = 0; pc < pattern.length; pc++) {
    ec = advance(ec, expression);
    let e = expression[ec];
    let p = pattern[pc];
    //console.log(p + ", " + e);
    if (isSymbol(p)) {
      if (symbolsMatched[p] === undefined) {
        if (e == '(') {
          do {
            ec = advance(ec, expression);
            e += expression[ec];
          } while (expression[ec] != ')')
        }
        symbolsMatched[p] = e;
        //console.log("p: " + p + ", " + e);
      }
      else {
        let ep = symbolsMatched[p];
        //console.log("ep: " + ep + ", " + expression[ec]);
        let epc = 0;
        for (epc = 0; epc < ep.length; epc++) {
          if (expression[ec + epc] != ep[epc]) return false;
        }
        ec += epc - 1;
      }
    }
    else {
      if (e != p) return false;
    }
  }
  // not all expression done
  if (ec + 1 != expression.length) return false;

  console.log(pattern);
  console.log(symbolsMatched);
  return true;
}
function rewrite(rule) {
  let rew = "";
  for (let i = 0; i < rule.rewrite.length; i++) {
    let r = rule.rewrite[i];
    if (isSymbol(r)) {
      rew += symbolsMatched[r];
    }
    else {
      rew += r;
    }
  }
  return rew;
}
function normalize(expression) {
  let norm = "";
  let current = 0;
  let e;
  while (!isAtEnd()) {
    e = advance();
    if (current == 1 && e == '-') norm += "(-1)*";
    else if (isDigit(e) && isAlpha(peek())) norm += e + "*";
    else if (isAlpha(e) && isDigit(peek())) norm += e + "*";
    else if (isDigit(e) && peek() == "(") norm += e + "*";
    else if (isAlpha(e) && peek() == "(") norm += e + "*";
    else if (e == ')' && isAlpha(peek())) norm += e + "*";
    else if (e == ')' && isDigit(peek())) norm += e + "*";
    else if (e == ')' && peek() == "(") norm += e + "*";
    else
      norm += e;
  }
  return norm;

  function isDigit(c) {
    return c >= '0' && c <= '9';
  }
  function isAlpha(c) {
    return (c >= 'a' && c <= 'z') ||
      (c >= 'A' && c <= 'Z');
  }
  function advance() {
    current++;
    return expression[current - 1];
  }
  function peek() {
    if (isAtEnd()) return '\0';
    return expression[current];
  }
  function isAtEnd() {
    return current >= expression.length;
  }
}

function isSymbol(str) {
  return str.length === 1 && str.match(/[a-zA-Z]/i);
}
function advance(ec, expression) {
  if (ec + 1 < expression.length)
    return ++ec;
  else
    throw "end of expression reached!";
}

// PatmatcherTest ###############################
function PatmatcherTest() {
  //let expression = '2*x+3*x';
  //let expression = 'x*2+x*3';
  //let expression = 'x*(1+2)+x*3';
  let expression = '(a+b)*(1+2)+(a+b)*(3+4)';
  //let expression = '2.5x+(-3)x';

  console.log(expression);
  expression = normalize(expression);
  console.log(expression);

  let rule = {
    pattern: ['a*c+b*c', 'c*a+b*c', 'a*c+c*b', 'c*a+c*b'],
    rewrite: '(a+b)*c'
  }
  console.log(rule);

  let rewrite = Patmatcher(expression, rule);
  console.log(rewrite);
}
// ecports #####################################
exports.patmatchertest = PatmatcherTest;