class TestRunner {
  constructor(name) {
    this.name = name;
    this.testNo = 1;
  }

  expectTrue(cond) {
    try {
      if (cond()) {
        this._pass();
      } else {
        this._fail();
      }
    } catch (e) {
      this._fail(e);
    }
  }

  expectFalse(cond) {
    this.expectTrue(() => !cond());
  }

  expectException(block) {
    try {
      block();
      this._fail();
    } catch (e) {
      this._pass();
    }
  }

  _fail(e = undefined) {
    console.log(`FAILED: Test #${this.testNo++} of ${this.name}`);
    if (e != undefined) {
      console.log(e);
    }
  }

  _pass() {
    console.log(`PASSED: Test #${this.testNo++} of ${this.name}`);
  }
}

function match({ string, pattern }) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const letsAndNums = "abcdefghijklmnopqrstuvwxyz0123456789";

  if (string.length !== pattern.length) return false;

  for (let index = 0; index < pattern.length; index++) {
    switch (pattern[index]) {
      case "a":
        if (letters.indexOf(string[index]) === -1) return false;
        break;
      case "d":
        if (numbers.indexOf(string[index]) === -1) return false;
        break;
      case "*":
        if (letsAndNums.indexOf(string[index]) === -1) return false;
        break;
      case " ":
        if (string[index] !== " ") return false;
        break;
      default:
        throw "Error";
    }
  }

  return true;
}

function testMatch() {
  const runner = new TestRunner("match");

  runner.expectFalse(() => match({ string: "xy", pattern: "a" }));
  runner.expectFalse(() => match({ string: "x", pattern: "d" }));
  runner.expectFalse(() => match({ string: "0", pattern: "a" }));
  runner.expectFalse(() => match({ string: "*", pattern: " " }));
  runner.expectFalse(() => match({ string: " ", pattern: "a" }));

  runner.expectTrue(() => match({ string: "01 xy", pattern: "dd aa" }));
  runner.expectTrue(() => match({ string: "1x", pattern: "**" }));

  runner.expectException(() => match({ string: "x", pattern: "w" }));
}
