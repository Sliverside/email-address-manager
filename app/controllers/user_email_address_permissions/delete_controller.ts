import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

const validator = vine.compile(vine.object({ id: vine.number().positive() }))

export default class DeleteController {
  async handle({ auth, request, session, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const payload = await validator.validate(request.only(['id']))

    const permission = await user
      .related('ownedEmailAddressPermissions')
      .query()
      .where('id', payload.id)
      .first()

    console.log(permission)

    if (!permission) {
      session.flashErrors({
        error: "this permission doesn't exists or you don't have the right to delete it",
      })
      return response.redirect().back()
    }

    await permission.delete()

    session.flash({
      success: `the permission has been deleted !`,
    })

    return response.redirect().back()
  }
}
