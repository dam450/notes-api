const { sum } = require('./sum.js');

describe('sum test', () => {
  it('sum of 2 + 2 must be 4', () => {
    const a = 2,
      b = 2
    const result = sum(a, b)

    expect(result).toEqual(4)
  })
})
