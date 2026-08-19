const { add, divide } = require('../src/app');

describe('add()', () => {
  test('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('adds negative numbers', () => {
    expect(add(-2, -3)).toBe(-5);
  });
});

describe('divide()', () => {
  test('divides two numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  test('throws on divide by zero', () => {
    expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
  });
});
