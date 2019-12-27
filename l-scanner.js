//http://craftinginterpreters.com/

// Token ##############################################

/*
TokenType                                    
  // Single-character tokens.                      
  LEFT_PAREN, RIGHT_PAREN, LEFT_BRACE, RIGHT_BRACE,
  COMMA, DOT, MINUS, PLUS, SEMICOLON, SLASH, STAR, 

  // One or two character tokens.                  
  BANG, BANG_EQUAL,                                
  EQUAL, EQUAL_EQUAL,                              
  GREATER, GREATER_EQUAL,                          
  LESS, LESS_EQUAL,                                

  // Literals.                                     
  IDENTIFIER, STRING, NUMBER,                      

  // Keywords.                                     
  AND, CLASS, ELSE, FALSE, FUN, FOR, IF, NIL, OR,  
  PRINT, RETURN, SUPER, THIS, TRUE, VAR, WHILE,    

  EOF                                              
*/
let keywords = [
  "and", "class", "else", "false", "fun", "for", "if", "nil", "or", "print", "return", "super", "this", "true", "var", "while"
]

//let token = new Token("NUMBER", "123", 123)
//console.log(token.toString())

//##############################################
// Token constructor 
function Token(type, lexeme, literal, position, line) {
  this.type = type;
  this.lexeme = lexeme;
  this.literal = literal;
  this.position = position;
  this.line = line;
}

// Token.prototype.toString = function() {
//   return this.type + " " + this.lexeme + " " + this.literal + " " + this.position;
// }

//Scanner ############################################## 
// scanner main 
function Scanner(strSource) {
  // scanner variables
  let source = strSource
  let tokens = []
  let start = 0;
  let current = 0;
  let line = 1;

  //source = strSource

  scanTokens()

  tokens.push(new Token("EOF", "", null, current + 1, line))
  return tokens
  //}
  function scanTokens() {
    while (!isAtEnd()) {
      // We are at the beginning of the next lexeme.
      start = current;
      scanToken();
    }
  }
  function scanToken() {
    let c = advance();
    switch (c) {
      case '(': addToken("LEFT_PAREN"); break;
      case ')': addToken("RIGHT_PAREN");
        // insert '*' between ')' and digit, indentifier or '('
        if (isDigit(peek())) addToken("STAR", null, "*");
        if (isAlpha(peek())) addToken("STAR", null, "*");
        if (peek() == '(') addToken("STAR", null, "*");
        break;
      case '{': addToken("LEFT_BRACE"); break;
      case '}': addToken("RIGHT_BRACE"); break;
      case ',': addToken("COMMA"); break;
      case '.': addToken("DOT"); break;
      case '-': addToken("MINUS"); break;
      case '+': addToken("PLUS"); break;
      case ';': addToken("SEMICOLON"); break;
      case '*': addToken("STAR"); break;
      case '!': addToken(match('=') ? "BANG_EQUAL" : "BANG"); break;
      case '=': addToken(match('=') ? "EQUAL_EQUAL" : "EQUAL"); break;
      case '<': addToken(match('=') ? "LESS_EQUAL" : "LESS"); break;
      case '>': addToken(match('=') ? "GREATER_EQUAL" : "GREATER"); break;
      case '/':
        if (match('/')) {
          // A comment goes until the end of the line.   
          while (peek() != '\n' && !isAtEnd()) advance();
        } else if (match('*')) {
          // Skip block comment /*...*/
          blockComment();
        } else {
          addToken("SLASH");
        }
        break;
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace.                      
        break;
      case '\n': line++; break;
      case '"': string(); break;
      default:
        if (isDigit(c)) {
          number();
          // insert '*' between digit and indentifier or '('
          if (isAlpha(peek())) addToken("STAR", null, "*");
          if (peek() == '(') addToken("STAR", null, "*");
        } else if (isAlpha(c)) {
          identifier();
          // insert '*' between alpha and digit or '('
          if (isDigit(peek())) addToken("STAR", null, "*");
          if (peek() == '(') addToken("STAR", null, "*");
        } else {
          error(line, "Unexpected character '" + c + "' at position: " + current);
        }
        break;
    }
  }
  // scanner utilites ###############################
  function isAtEnd() {
    return current >= source.length;
  }
  function isDigit(c) {
    return c >= '0' && c <= '9';
  }
  function isAlpha(c) {
    return (c >= 'a' && c <= 'z') ||
      (c >= 'A' && c <= 'Z') ||
      c == '_';
  }
  function isAlphaNumeric(c) {
    return isAlpha(c) || isDigit(c);
  }
  function advance() {
    current++;
    return source.charAt(current - 1);
  }
  function peek() {
    if (isAtEnd()) return '\0';
    return source.charAt(current);
  }
  function peekNext() {
    if (current + 1 >= source.length) return '\0';
    return source.charAt(current + 1);
  }
  function match(expected) {
    if (isAtEnd()) return false;
    if (source.charAt(current) != expected)
      return false;
    current++;
    return true;
  }
  function addToken(type, literal, text) {
    if (typeof text === "undefined")
      text = source.substring(start, current);
    if (typeof literal === "undefined")
      literal = null;
    tokens.push(new Token(type, text, literal, current, line));
  }
  function string() {
    while (peek() != '"' && !isAtEnd()) {
      if (peek() == '\n') line++;
      advance();
    }
    // Unterminated string.                            
    if (isAtEnd()) {
      error(line, "Unterminated string.");
      return;
    }
    // The closing "."
    advance();
    // Trim the surrounding quotes.                    
    let value = source.substring(start + 1, current - 1);
    addToken("STRING", value);
  }
  function number() {
    while (isDigit(peek())) advance();
    // Look for a fractional part.                     
    if (peek() == '.' && isDigit(peekNext())) {
      // Consume the "."    
      advance();
      while (isDigit(peek())) advance();
    }
    addToken("NUMBER", parseFloat(source.substring(start, current)));
  }
  function identifier() {
    //while (isAlphaNumeric(peek())) advance();
    while (isAlpha(peek())) advance();
    // See if the identifier is a reserved word.   
    let text = source.substring(start, current);
    // is keyword?
    let type = ""
    if (keywords.includes(text))
      type = text.toUpperCase()
    else
      type = "IDENTIFIER"
    addToken(type);
  }
  function blockComment() {
    while (peek() != '*' && !isAtEnd()) {
      if (peek() == '\n') line++;
      // Nested block comment
      if (match('/')) {
        if (match('*')) {
          blockComment();
          if (isAtEnd()) return;
        }
        continue;
      }
      advance();
    }
    // Unterminated block comment. 
    if (isAtEnd()) {
      error(line, "Unterminated block comment.");
      return;
    }
    // Consume the "*"
    advance();
    // Terminated block comment
    if (match('/')) return;
    // Continue block comment
    blockComment();
  }
}
// error ##############################################
function error(line, message) {
  console.log("line " + line + ": " + message)
}
//ScannerTest ##############################################
function ScannerTest() {

  //let input = '+ x x'
  //let input = '+ x    x'
  //let input = '2x'
  //let input = '+ b  b'
  //let input = '+ b  n'
  //let input = '2b'
  //let input = '(+ (* 2 f) (* 3 f))'
  //let input = '(2.4f /*...*/ + 3f)'
  let input = '(2.4f /*./*.*/.*/ + 3';

  let tokens = Scanner(input);
  console.log(tokens);
}

//exports ##############################################
exports.scanner = Scanner;
exports.scannerTest = ScannerTest;
exports.token = Token;