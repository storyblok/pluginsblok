import { isRoles } from './isRoles'

describe('isRoles', () => {
  it('should be true', () => {
    expect(
      isRoles([
        {
          name: 'admin',
        },
        {
          name: 'developer',
        },
      ]),
    ).toBeTruthy()
  })
  it('should be true for empty arrays', () => {
    expect(isRoles([])).toBeTruthy()
  })
  it('should be false for objects', () => {
    expect(isRoles({})).toBeFalsy()
  })
  it('should be false for null', () => {
    expect(isRoles(null)).toBeFalsy()
  })
  it('should be false for undefined', () => {
    expect(isRoles(undefined)).toBeFalsy()
  })
  it('should be false when any item is not a role', () => {
    expect(
      isRoles([
        {
          name: 'admin',
        },
        {
          id: 123,
        },
      ]),
    ).toBeFalsy()
  })
})
