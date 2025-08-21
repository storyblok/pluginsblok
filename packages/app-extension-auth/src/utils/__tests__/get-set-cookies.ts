import http from 'http'

export const getSetCookies = (res: http.ServerResponse): string[] => {
  const headers = res.getHeader('Set-Cookie')
  expect(Array.isArray(headers)).toBeTruthy()
  if (!Array.isArray(headers)) {
    return []
  }
  return headers
}
