//http://craftinginterpreters.com/scanning.html

const sc = require("./l-scanner.js");
const Scanner = sc.scanner;

const par = require("./l-parser.js");
const Parser = par.parser;

const ast = require("./l-ast.js");
const AstPrinter = ast.astPrinter;

const ip = require("./l-interpreter.js");
const Interpreter = ip.interpreter;

// Lox console ###############################################
function Lox() {
  let printer;

  //let source = '2x+3x';
  let source = '2x+3x';
  console.log(source);
  let sourceTokens = Scanner(source);
  //console.log(sourceTokens);
  let sourceExpression = Parser(sourceTokens);
  if (!sourceExpression) return;
  printer = new AstPrinter();
  console.log(printer.print(sourceExpression));

  let rule = {
    //pattern: ['a*c+b*c', 'c*a+b*c', 'a*c+c*b', 'c*a+c*b'],
    pattern: 'a*c+b*c',
    rewrite: '(a+b)*c'
  }
  console.log(rule);
  let patternTokens = Scanner(rule.pattern);
  //console.log(patternTokens);
  let patternExpression = Parser(patternTokens);
  if (!patternExpression) return;
  printer = new AstPrinter();
  console.log(printer.print(patternExpression));



  // const interpreter = new Interpreter();
  // const value = interpreter.interpret(expression);
  // if (value) console.log(value);
}

// exports ###################################################
exports.lox = Lox;