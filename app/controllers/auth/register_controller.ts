import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

const validator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(8).maxLength(200).trim(),
  })
)

export default class RegisterController {
  async show({ view }: HttpContext) {
    return view.render('auth/register')
  }

  async store({ auth, request, response, session }: HttpContext) {
    const data = await validator.validate(request.all())
    const user = await User.create(data)

    await auth.use('web').login(user)

    session.flash({
      success: `your account has been created with success !`,
    })

    return response.redirect().toRoute('emails.index')
  }
}
