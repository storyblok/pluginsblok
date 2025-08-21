import { AuthHandlerParams } from '../storyblok-auth-api'

export const DEFAULT_SESSION_IDENTIFIER = 'sb.auth'

export const sessionIdentifier = (
  sessionKey: AuthHandlerParams['sessionKey'],
) => sessionKey ?? DEFAULT_SESSION_IDENTIFIER
