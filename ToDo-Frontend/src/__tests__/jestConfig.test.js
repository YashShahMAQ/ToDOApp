test('jest config', () => {
  const jestConfig = require('../../jest.config.cjs');
  expect(jestConfig.transform).toEqual({
    "^.+\\.(js|jsx)$": "babel-jest"
  });
});