import { AppSessionQuery } from './AppSessionKeys'
import { AppSession } from './AppSession'

export type AppSessionStore = {
  get: (
    keys: AppSessionQuery,
    options?: {
      autoRefresh?: boolean
    },
  ) => Promise<AppSession | undefined>
  getAll?: () => Promise<AppSession[]>
  put: (session: AppSession) => Promise<boolean>
  remove: (keys: AppSessionQuery) => Promise<boolean>
}
