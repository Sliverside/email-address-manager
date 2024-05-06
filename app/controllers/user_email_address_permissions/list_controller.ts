import type { HttpContext } from '@adonisjs/core/http'

export default class ListController {
  async handle({ view, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    await user.load('ownedEmailAddressPermissions', (permissionsQuery) => {
      permissionsQuery.preload('user')
    })

    let permissions = user.ownedEmailAddressPermissions

    return view.render('user_email_address_permisions/list', { permissions })
  }
}
