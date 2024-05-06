import EmailAddress from '#models/email_address'
import User from '#models/user'
import UserEmailAddressPermission from '#models/user_email_address_permission'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'

const validator = vine.compile(
  vine.object({
    domain: vine
      .string()
      .trim()
      .exists(async (existsdb, value) => {
        const domain = await existsdb
          .from(EmailAddress.table)
          .select('domain')
          .where('domain', value)
          .first()

        return domain !== null
      }),
    name: vine
      .string()
      .trim()
      .exists(async (existsDb, value, field) => {
        if (value === '*') return true

        const domain = field.parent?.domain

        if (typeof domain !== 'string') return false

        const name: string | null = await existsDb
          .from(EmailAddress.table)
          .select('name')
          .where('domain', domain)
          .where('name', value)
          .first()

        console.log(name)
        return name !== null
      }),
    userEmail: vine.string().email().normalizeEmail(),
  })
)

export default class CreateController {
  async show({ view }: HttpContext) {
    const domains: { domain: string }[] = await db
      .from(EmailAddress.table)
      .select('domain')
      .distinct('domain')

    return view.render('user_email_address_permisions/create', {
      domains: domains.map((row) => {
        return {
          value: row.domain,
          label: row.domain,
        }
      }),
    })
  }

  async store({ request, auth, response, session }: HttpContext) {
    const payload = await validator.validate(request.all())

    const admin = auth.getUserOrFail()

    if (!admin.isAdmin()) {
      session.flash(payload)
      session.flashErrors({ error: 'no user with this email exists' })
      return response.redirect().back()
    }

    let parentPermission: UserEmailAddressPermission | null = null

    if (!admin.isSuperAdmin()) {
      const orderBy = db.raw("case when `name` = '*' then 1 else 0 end")
      parentPermission = await admin
        .related('EmailAddressPermissions')
        .query()
        .where('domain', payload.domain)
        .where((builder) => {
          builder.where('name', '*')
          if (payload.name !== '*') builder.orWhere('name', payload.name)
        })
        .orderBy(orderBy, 'desc')
        .first()

      if (!parentPermission) {
        session.flash(payload)
        session.flashErrors({ error: "you don't have the right to create this permission" })
        return response.redirect().back()
      }
    }

    const user = await User.findBy({ email: payload.userEmail })

    if (!user) {
      session.flash(payload)
      session.flashErrors({ error: 'no user with this email exists' })
      return response.redirect().back()
    }

    if (admin.id === user.id) {
      session.flashErrors({ error: "You can't self assign permissions" })
      return response.redirect().back()
    }

    await admin.related('ownedEmailAddressPermissions').create({
      parentId: parentPermission?.id,
      adminId: admin.id,
      userId: user.id,
      domain: payload.domain,
      name: payload.name,
    })

    session.flash({
      success: `user permission has been created`,
    })

    return response.redirect().toRoute('permissions.list')
  }
}
