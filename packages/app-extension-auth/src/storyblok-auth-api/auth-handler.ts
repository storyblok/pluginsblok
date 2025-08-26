import http from 'http'
import { AuthHandlerParams } from './AuthHandlerParams'
import { handleAnyRequest } from './handle-requests'
import { createCookieAdapter } from '../session-adapters/createCookieAdapter'
import { createInternalAdapter } from '../session-adapters/internalAdapter'

/**
 * Auth handler for Node.js
 * @param params
 */
export const authHandler = (
  params: AuthHandlerParams,
): http.RequestListener => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return async (req, res) => {
    const { url } = req
    if (typeof url !== 'string') {
      res.writeHead(400).end()
      return
    }

    const adapter = createInternalAdapter({
      params,
      req,
      res,
      adapter: createCookieAdapter({
        sessionKey: params.sessionKey,
        clientSecret: params.clientSecret,
      }),
    })

    const responseElement = await handleAnyRequest({
      params,
      url,
      adapter,
    })

    if (responseElement.type === 'configuration-error') {
      console.error(
        `@stoyblok/app-extension-auth is misconfigured: ${responseElement.message ?? ''}`,
      )
    }

    if (responseElement.type === 'error' && responseElement.message) {
      console.error(responseElement.message)
    }

    res
      .writeHead(302, {
        Location: responseElement.redirectTo,
      })
      .end()
  }
}
