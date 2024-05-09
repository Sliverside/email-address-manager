import EmailAddress, { EmailAddressStatus } from '#models/email_address'
import EmailAddressService from '#services/email_address_service'
import {
  createSupplierEmailValidator,
  updateSupplierEmailValidator,
} from '#validators/supplier_email_address'
import type { HttpContext } from '@adonisjs/core/http'
import { suppliers } from '#email_address_supplier/index'
import {
  EmailAddressDoesntExistError,
  EmailAddressSupplierError,
} from '#email_address_supplier/errors'
import db from '@adonisjs/lucid/services/db'
import { Roles } from '#models/role'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

export default class EmailsController {
  /**
   * Display a list of resource
   */
  async index({ view, auth }: HttpContext) {
    await EmailAddressService.synchronise()

    const user = auth.getUserOrFail()

    let query: ModelQueryBuilderContract<typeof EmailAddress, EmailAddress> | null = null

    if (user.roleId === Roles.SUPER_ADMIN) {
      query = EmailAddress.query()
    } else {
      await user.load('EmailAddressPermissions')

      const permissions = user.EmailAddressPermissions

      if (permissions.length > 0) {
        query = EmailAddress.query()

        for (const permission of permissions) {
          query.orWhere((builder) => {
            builder.where('domain', permission.domain)
            if (permission.name !== '*') builder.andWhere('name', permission.name)
          })
        }
      }
    }

    const orderBy = db.raw("case when `status` = 'active' then 1 else 0 end")

    const emails = query ? await query.orderBy(orderBy, 'desc') : []

    return view.render('email_addresses/list', { emails })
  }

  /**
   * Display form to create a new record
   */
  async create({ view, bouncer, auth }: HttpContext) {
    await bouncer.with('EmailAddressPolicy').authorize('create')

    const user = auth.getUserOrFail()
    await user.load('EmailAddressPermissions')

    const permissions = user.EmailAddressPermissions

    const suppliersFormatted = await Promise.all(
      suppliers.map((s) =>
        s.listDomains().then((domains) => {
          if (!user.isSuperAdmin()) {
            domains = domains.filter((domain) =>
              permissions.find((p) => p.domain === domain && p.name === '*')
            )
          }

          return {
            name: s.name,
            domains: domains.map((domain) => ({ value: domain })),
          }
        })
      )
    )

    suppliersFormatted.forEach((s) => console.log(s))

    return view.render('email_addresses/create', {
      suppliers: suppliersFormatted.filter((s) => s.domains.length > 0),
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ bouncer, request, response, session }: HttpContext) {
    const data = request.all()
    let payload = await createSupplierEmailValidator.validate(data)

    await bouncer.with('EmailAddressPolicy').authorize('store', payload)

    const supplier = EmailAddressService.getSupplier(payload.supplierName)

    let failure: boolean | undefined
    let error: any

    await supplier.create(payload).catch((err) => {
      failure = true
      error = err
    })

    if (failure) {
      let message = 'an error append while creating email address'

      if (
        error instanceof EmailAddressDoesntExistError ||
        error instanceof EmailAddressSupplierError
      ) {
        message = error.message
      }

      session.flashExcept(['_csrf', '_method', 'password', 'password_confirmation'])
      session.flashErrors({ error: message })

      response.redirect().back()
      return
    }

    const emailAddress = await EmailAddress.create({
      name: payload.name,
      domain: payload.domain,
      description: payload.description,
      supplierName: supplier.name,
      type: payload.type,
      password: payload.password,
    })

    session.flash({
      success: `the email address "${emailAddress}" has been created with success !`,
    })

    response.redirect().toRoute('emails.index')
  }

  /**
   * Show individual record
   */
  async show({ params: { id }, view, response, session, bouncer }: HttpContext) {
    const email = await EmailAddress.find(id)

    if (!email) {
      session.flashErrors({ error: "this email doesn't exist" })
      return response.redirect().toRoute('emails.index')
    }

    await bouncer.with('EmailAddressPolicy').authorize('show', email)

    return view.render('email_addresses/show', { email: email })
  }

  /**
   * Edit individual record
   */
  async edit({ params: { id }, view, response, session, bouncer }: HttpContext) {
    const email = await EmailAddress.find(id)

    if (!email) {
      session.flashErrors({ error: "this email doesn't exist" })
      return response.redirect().toRoute('emails.index')
    }

    await bouncer.with('EmailAddressPolicy').authorize('edit', email)

    return view.render('email_addresses/edit', { email: email })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params: { id }, request, response, session, bouncer }: HttpContext) {
    const email = await EmailAddress.find(id)

    if (!email) {
      session.flashErrors({ error: "this email doesn't exist" })

      return response.redirect().back()
    }

    await bouncer.with('EmailAddressPolicy').authorize('update', email)

    const data = request.all()
    const payload = await updateSupplierEmailValidator.validate(data)

    const supplier = EmailAddressService.getSupplier(email.supplierName)

    let failure: boolean | undefined
    let error: any

    await supplier.edit(email, payload).catch((err) => {
      failure = true
      error = err
    })

    if (failure) {
      let message = 'An error append while editing the email address'

      if (
        error instanceof EmailAddressDoesntExistError ||
        error instanceof EmailAddressSupplierError
      ) {
        message = error.message
      }

      session.flashExcept(['_csrf', '_method', 'password', 'password_confirmation'])
      session.flashErrors({ error: message })

      return response.redirect().back()
    }

    email.merge(payload)
    if (email.$isDirty) email.save()

    session.flash({
      success: `the email address "${email}" has been updated with success !`,
    })

    return response.redirect().toRoute('emails.index')
  }

  /**
   * Set status to trash
   */
  async trash({ params: { id }, session, response }: HttpContext) {
    const email = await EmailAddress.find(id)

    if (!email) {
      session.flashErrors({ error: "this email doesn't exist" })

      return response.redirect().back()
    }

    const supplier = EmailAddressService.getSupplier(email.supplierName)

    let failure: boolean | undefined
    let error: any

    await supplier.delete(email).catch((err) => {
      failure = true
      error = err
    })

    if (failure) {
      let message = 'An error append while deleting the email address'

      if (
        error instanceof EmailAddressDoesntExistError ||
        error instanceof EmailAddressSupplierError
      ) {
        message = error.message
      }

      session.flashErrors({ error: message })

      return response.redirect().back()
    }

    email.status = EmailAddressStatus.TRASHED
    if (email.$isDirty) await email.save()

    session.flash({
      success: `the email address "${email}" has been trashed !`,
    })

    return response.redirect().toRoute('emails.index')
  }
}
