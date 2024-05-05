import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

const validator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().trim(),
  })
)

export default class LoginController {
  async show({ view }: HttpContext) {
    return view.render('auth/login')
  }

  async store({ request, response, auth, session }: HttpContext) {
    const data = request.only(['email', 'password'])

    const payload = await validator.validate(data)

    const user = await User.verifyCredentials(payload.email, payload.password)
    await auth.use('web').login(user)

    session.flash({
      success: `hello ${user.email}, you are connected`,
    })

    response.redirect().toRoute('emails.index')
  }
}
