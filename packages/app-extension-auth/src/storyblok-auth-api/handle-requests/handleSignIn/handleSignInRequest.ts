import { generators } from 'openid-client'
import { openidClient } from '../openidClient'
import { redirectUri } from '../redirectUri'
import { AuthHandlerParams } from '../../AuthHandlerParams'
import { HandleAuthRequest } from '../HandleAuthRequest'
import { InternalAdapter } from '../../../session-adapters/internalAdapter'

export const handleSignInRequest: HandleAuthRequest<{
  url: string
  params: AuthHandlerParams
  adapter: InternalAdapter
}> = async ({ params, adapter }) => {
  const code_verifier = generators.codeVerifier()
  const state = generators.state()
  const code_challenge = generators.codeChallenge(code_verifier)

  try {
    const redirectTo = openidClient(params).authorizationUrl({
      // The scope is actually ignored by Storyblok's OAuth API.
      //  But we keep it here just in case something changes in the future, it does no harm.
      scope: ['read_content', 'write_content'].join(' '),
      code_challenge,
      state,
      code_challenge_method: 'S256',
      redirect_uri: redirectUri(params),
    })

    await adapter.setCallbackData({
      returnTo: params?.successCallback ?? '/', // TODO read from request query params, then either use the successCallback as fallback, or remove the entirely
      codeVerifier: code_verifier,
      state,
    })

    return {
      type: 'success',
      redirectTo,
    }
  } catch (e) {
    return {
      type: 'error',
      message: `Unexpected error. ${e instanceof Error ? e.message : ''}`,
    }
  }
}
