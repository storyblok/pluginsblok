import { isUser } from './isUser'

describe('isUser', () => {
  it('should be true', () => {
    expect(
      isUser({
        id: 123,
        friendly_name: 'Johannes Lindgren',
      }),
    ).toBeTruthy()
  })
  it('should be false for wrong type of id', () => {
    expect(
      isUser({
        id: '123',
        friendly_name: 'Johannes Lindgren',
      }),
    ).toBeFalsy()
  })
  it('should be false for wrong type of friendly_name', () => {
    expect(
      isUser({
        id: '123',
        friendly_name: {
          firstName: 'Johannes',
        },
      }),
    ).toBeFalsy()
  })
  it('should be false for missing id', () => {
    expect(
      isUser({
        friendly_name: 'Johannes Lindgren',
      }),
    ).toBeFalsy()
  })
  it('should be false for missing friendly_name', () => {
    expect(
      isUser({
        id: '123',
      }),
    ).toBeFalsy()
  })
  it('should be false for wrong undefined', () => {
    expect(isUser(undefined)).toBeFalsy()
  })
  it('should be false for array', () => {
    expect(isUser([])).toBeFalsy()
  })
})
