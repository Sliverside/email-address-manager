import { defineConfig } from '@adonisjs/auth'
import { InferAuthEvents, Authenticators } from '@adonisjs/auth/types'
import { SessionLucidUserProvider, sessionGuard } from '@adonisjs/auth/session'
import type User from '#models/user'
import type {
  SessionGuardUser,
  SessionLucidUserProviderOptions,
} from '@adonisjs/auth/types/session'

/**
 * Override the default session user provider to preload permissions
 */
const sessionUserProvider = (options: SessionLucidUserProviderOptions<typeof User>) => {
  return new (class extends SessionLucidUserProvider<typeof User> {
    async findById(
      identifier: string | number
    ): Promise<SessionGuardUser<InstanceType<typeof User>> | null> {
      const model = await this.getModel()
      const user = await model
        .query()
        .where(model.primaryKey, identifier)
        .preload('emailAddressPermissions')
        .first()

      if (!user) {
        return null
      }

      return this.createUserForGuard(user)
    }
  })(options)
}

const authConfig = defineConfig({
  default: 'web',
  guards: {
    web: sessionGuard({
      useRememberMeTokens: false,
      provider: sessionUserProvider({
        model: () => import('#models/user'),
      }),
    }),
  },
})

export default authConfig

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module '@adonisjs/auth/types' {
  interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module '@adonisjs/core/types' {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}
