import type { ApplicationService } from '@adonisjs/core/types'
import edge from 'edge.js'
import { faker } from '@faker-js/faker'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    // this.app.container.singleton(EmailsProviderService, () => new TestEmailsProviderService())
  }

  /**
   * The container bindings have booted
   */
  async boot() {
    edge.global('faker', faker)
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
