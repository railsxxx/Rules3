// https://github.com/sohamkamani/javascript-design-patterns-for-humans#-visitor

// set of objects
// constructor function called with new
function Monkey() {
  // private function
  function monkeyShout() {
    console.log('Ooh oo aa aa!');
  }
  // public functions
  this.shout = function() {
    monkeyShout();
  }
  this.accept = function(operation) {
    operation.visitMonkey(this);
  }
}

// factory function called without new
function Lion() {
  return {
    roar() {
      console.log('Roaaar!');
    },
    accept(operation) {
      operation.visitLion(this);
    }
  }
}

// class with all public
class Dolphin {
  speak() {
    console.log('Tuut tuttu tuutt!');
  }

  accept(operation) {
    operation.visitDolphin(this);
  }
}

// visitor speak
const speak = {
  visitMonkey : function(monkey) {
    monkey.shout();
  },
  visitLion(lion) {
    lion.roar();
  },
  visitDolphin(dolphin) {
    dolphin.speak();
  }
}

// visitor jump
const jump = {
  visitMonkey(monkey) {
    console.log('Jumped 20 feet high! on to the tree!');
  },
  visitLion(lion) {
    console.log('Jumped 7 feet! Back on the ground!');
  },
  visitDolphin(dolphin) {
    console.log('Walked on water a little and disappeared');
  }
}


// visitorTest ################################################
function VisitorTest() {
  // create objects
  const monkey = new Monkey();
  const lion = Lion();
  const dolphin = new Dolphin();
  // use visitor speak
  monkey.accept(speak);   // Ooh oo aa aa!    
  lion.accept(speak);     // Roaaar!
  dolphin.accept(speak);  // Tuut tutt tuutt!
  // use visitor jump
  monkey.accept(jump);   // Jumped 20 feet high! on to the tree!
  lion.accept(jump);     // Jumped 7 feet! Back on the ground! 
  dolphin.accept(jump);  // Walked on water a little and disappeared
}

// export ######################################################
exports.visitorTest = VisitorTest