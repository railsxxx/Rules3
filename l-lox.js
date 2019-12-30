//http://craftinginterpreters.com/scanning.html

const sc = require("./l-scanner.js");
const Scanner = sc.scanner;

const par = require("./l-parser.js");
const Parser = par.parser;

const ast = require("./l-ast.js");
const AstPrinter = ast.astPrinter;

const ip = require("./l-interpreter.js");
const Interpreter = ip.interpreter;

const rm = require("./l-ruleMatcher.js");
const RuleMatcher = rm.rulematcher

// Lox console ###############################################
function Lox() {
  let printer;

  //let source = '2x+3x';
  //let source = '2x+3x';
  //let source = '1+2+(4+5+x)+3';
  //let source = '1-2-(4-5)-x-3';
  let source = 'x*-2/3*(4+5)/(6-4)';

  console.log(source);
  let sourceTokens = Scanner(source);
  //console.log(sourceTokens);
  let sourceExpression = Parser(sourceTokens);
  if (!sourceExpression) return;
  printer = new AstPrinter();
  console.log(printer.print(sourceExpression));

  // let rule = {
  //   //pattern: ['a*c+b*c', 'c*a+b*c', 'a*c+c*b', 'c*a+c*b'],
  //   pattern: ['a*c+b*c'],
  //   rewrite: '(a+b)*c'
  // }
  // console.log(rule);
  // let patternTokens = Scanner(rule.pattern[0]);
  // //console.log(patternTokens);
  // let patternExpression = Parser(patternTokens);
  // rule.patternExpression = patternExpression;
  // if (!patternExpression) return;
  // printer = new AstPrinter();
  // console.log(printer.print(patternExpression));

  // RuleMatcher(sourceExpression, rule);

  const interpreter = new Interpreter();
  const result = interpreter.interpret(sourceExpression);
  if (typeof result == "number") console.log(result);
  else console.log((new AstPrinter()).print(result));
}

// exports ###################################################
exports.lox = Lox;