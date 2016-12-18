var acorn = require('acorn');

module.exports = function findRequiresInText(txt) {
  var tokens = [],
    results = {};
  results.requires = [];
  results.required = {};
  tokens = [...acorn.tokenizer(txt)];
  function nextToken(i, x) {
    x = x || 1;
    return tokens[i + x];
  }
  function prevToken(i, x) {
    x = x || 1;
    return tokens[i - x];
  }
  tokens.forEach(function (token, i) {
    if (token.type.label === 'name' && token.value === 'require') {
      if (nextToken(i, 1).type.label === '(' && nextToken(i, 3).type.label === ')' && nextToken(i, 2).type.label === 'string') {
        results.requires.push(nextToken(i, 2).value);
        results.required[prevToken(i, 2).value] = nextToken(i, 2).value;
      }
    }
  });
  results.tokens = tokens;
  return results;
}
