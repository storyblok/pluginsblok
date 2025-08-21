import { isSpace } from './isSpace'

describe('isSpace', () => {
  it('should be true', () => {
    expect(
      isSpace({
        id: 123,
        name: "Johannes Lindgren's Space",
      }),
    ).toBeTruthy()
  })
  it('should be false for wrong type of id', () => {
    expect(
      isSpace({
        id: '123',
        name: "Johannes Lindgren's Space",
      }),
    ).toBeFalsy()
  })
  it('should be false for wrong type of name', () => {
    expect(
      isSpace({
        id: '123',
        name: {
          spaceName: 'Johannes',
        },
      }),
    ).toBeFalsy()
  })
  it('should be false for missing id', () => {
    expect(
      isSpace({
        name: "Johannes Lindgren's Space",
      }),
    ).toBeFalsy()
  })
  it('should be false for missing name', () => {
    expect(
      isSpace({
        id: '123',
      }),
    ).toBeFalsy()
  })
  it('should be false for wrong undefined', () => {
    expect(isSpace(undefined)).toBeFalsy()
  })
  it('should be false for array', () => {
    expect(isSpace([])).toBeFalsy()
  })
})
