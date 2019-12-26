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
  let source = '2*3/-x';
  console.log(source);

  let tokens = Scanner(source);
  //console.log(tokens);

  let expression = Parser(tokens);
  if (!expression) return;

  const printer = new AstPrinter();
  console.log(printer.print(expression));

  const interpreter = new Interpreter();
  const value = interpreter.interpret(expression);
  if(value) console.log(value);
}

// exports ###################################################
exports.lox = Lox;