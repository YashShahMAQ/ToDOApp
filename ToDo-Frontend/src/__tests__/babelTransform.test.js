test('babel transform', () => {
    const code = `import axios from 'axios';`;
    const transformedCode = require('@babel/core').transform(code, {
      presets: ['@babel/preset-env']
    }).code;
    expect(transformedCode).toContain('require("axios")');
  });