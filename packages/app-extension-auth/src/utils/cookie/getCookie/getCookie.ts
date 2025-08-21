import http from 'http'

/**
 * RegExp to match all characters to escape in a RegExp.
 */
const REGEXP_ESCAPE_CHARS_REGEXP = /[\^$\\.*+?()[\]{}|]/g

const getPattern = (name: string) =>
  new RegExp(
    '(?:^|;)*[0-9:]*' +
      name.replace(REGEXP_ESCAPE_CHARS_REGEXP, '\\$&') +
      '=([^;]*)',
  )

export const getCookie = (
  request: http.IncomingMessage,
  name: string,
): string | undefined => {
  return getAllCookies(request, name)[0]
}

export const getAllCookies = (
  request: http.IncomingMessage,
  name: string,
): string[] => {
  const headerCookies = (request.headers['cookie'] || '').split(/;\s*/)

  return headerCookies
    .map((cookie) => {
      const match = cookie.match(getPattern(name))
      if (!match) {
        return undefined
      }

      const value = match[1]

      if (value[0] === '"') {
        return value.slice(1, -1)
      }

      return value
    })
    .filter((cookie) => cookie !== undefined)
}
