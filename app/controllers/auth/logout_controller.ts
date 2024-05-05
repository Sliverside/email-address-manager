import type { HttpContext } from '@adonisjs/core/http'

export default class LogoutController {
  async handle({ auth, response }: HttpContext) {
    auth.use('web').logout()

    return response.redirect().toRoute('home')
  }
}
