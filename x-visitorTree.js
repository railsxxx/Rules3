//https://stackoverflow.com/questions/9831415/how-to-implement-visitor-pattern-in-javascript/9831695

// set of objects
function Node(val) {
  this.value = val;
  this.left = this.right = null;
}
Node.prototype.accept = function(visitorObj) {
  visitorObj.visit(this);
  if (this.left) this.left.accept(visitorObj);
  if (this.right) this.right.accept(visitorObj);
}
// Node.prototype.toString = function() {
//   return this.value + " " + this.left + " " + this.right;
// }
// Visitor #####################################################
function Visitor() {
  var that = this;
  this.visit = function(tgt) {
    tgt.value = "*" + tgt.value;
  }
  this.highlight = function(tgt) {
    tgt.accept(that);
  }
}
// VisitorTreeTest #############################################
function VisitorTreeTest() {
  var tree = new Node("A");
  tree.left = new Node("B1");
  tree.right = new Node("B2");
  tree.left.left = new Node("C1");
  tree.left.right = new Node("C2");

  console.log(tree.left);
  console.log("\n");
  (new Visitor()).highlight(tree.left);
  console.log(tree.left);
}
// exports #####################################################
exports.visitorTreeTest = VisitorTreeTest;

