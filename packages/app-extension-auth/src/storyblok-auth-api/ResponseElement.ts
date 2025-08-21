/**
 * This object describes an HTTP response in a framework-agnostic way.
 * The idea is to create one function that parses an incoming HTTP message into a `ResponseElement`.
 */
export type ResponseElement = {
  type: 'success' | 'error' | 'configuration-error'
  redirectTo?: string
  message?: string
}
