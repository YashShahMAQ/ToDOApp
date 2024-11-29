test('module resolution', () => {
    expect(() => require('react-router-dom')).not.toThrow();
  });