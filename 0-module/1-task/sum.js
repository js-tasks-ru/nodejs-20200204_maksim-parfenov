function sum(a, b) {
  if (![a, b].every(Number)) {
    throw new TypeError();
  }

  return a + b;
}

module.exports = sum;
