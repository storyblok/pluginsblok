import { URLSearchParams } from 'node:url'

export const getQueryFromUrl = (url: string): URLSearchParams | undefined => {
  const [, queryString] = url.split('?')

  if (queryString) {
    return new URLSearchParams(queryString)
  }

  return undefined
}
