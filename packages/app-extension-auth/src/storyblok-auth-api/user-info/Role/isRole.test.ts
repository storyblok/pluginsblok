import { isRole } from './isRole'

describe('isRole', () => {
  it('should be true', () => {
    expect(
      isRole({
        name: 'Admin',
      }),
    ).toBeTruthy()
  })
  it('should be false for missing name', () => {
    expect(isRole({})).toBeFalsy()
  })
  it('should be false for wrong type of name', () => {
    expect(
      isRole({
        name: ['admin'],
      }),
    ).toBeFalsy()
  })
  it('should be false for undefined', () => {
    expect(isRole(undefined)).toBeFalsy()
  })
  it('should be false for null', () => {
    expect(isRole(undefined)).toBeFalsy()
  })
  it('should be false for array', () => {
    expect(isRole([])).toBeFalsy()
  })
  it('should be false for string', () => {
    expect(isRole('admin')).toBeFalsy()
  })
})
