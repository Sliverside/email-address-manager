import EmailAddress, { EmailAddressStatus } from '#models/email_address'
import EmailAddressService from '#services/email_address_service'
import { updateEmailValidator } from '#validators/email_address'
import { createSupplierEmailValidator } from '#validators/supplier_email_address'
import type { HttpContext } from '@adonisjs/core/http'
import { suppliers } from '#email_address_supplier/index'
import {
  EmailAddressDoesntExistError,
  EmailAddressSupplierError,
} from '#email_address_supplier/errors'
import db from '@adonisjs/lucid/services/db'

export default class EmailsController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    await EmailAddressService.synchronise()
    return view.render('email_addresses/list', {
      emails: await EmailAddress.query().orderBy(
        db.raw("case when `status` = 'active' then 1 else 0 end"),
        'desc'
      ),
    })
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    return view.render('email_addresses/create', {
      suppliers: await Promise.all(
        suppliers.map((s) =>
          s.listDomains().then((domains) => ({
            name: s.name,
            domains: domains.map((domain) => ({ value: domain })),
          }))
        )
      ),
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session }: HttpContext) {
    const data = request.all()
    let payload = await createSupplierEmailValidator.validate(data)

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
  async show({ params: { id }, view, response, session }: HttpContext) {
    const email = await EmailAddress.find(id)

    if (!email) {
      session.flashErrors({
        error: "this email doesn't exist",
      })
      response.redirect().toRoute('emails.index')
      return
    }

    return view.render('email_addresses/show', { email: email })
  }

  /**
   * Edit individual record
   */
  async edit({ params: { id }, view, response, session }: HttpContext) {
    const email = await EmailAddress.find(id)

    if (!email) {
      session.flashErrors({ error: "this email doesn't exist" })
      response.redirect().toRoute('emails.index')
      return
    }

    return view.render('email_addresses/edit', { email: email })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params: { id }, request, response, session }: HttpContext) {
    const email = await EmailAddress.find(id)

    if (!email) {
      session.flashErrors({ error: "this email doesn't exist" })

      response.redirect().back()
      return
    }

    const data = request.all()
    if (data.password && data.password.trim() === '') delete data.password
    const payload = await updateEmailValidator.validate(data)

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

      response.redirect().back()
      return
    }

    email.merge(payload)
    if (email.$isDirty) email.save()

    session.flash({
      success: `the email address "${email}" has been updated with success !`,
    })

    response.redirect().toRoute('emails.index')
  }

  /**
   * Set status to trash
   */
  async trash({ params: { id }, session, response }: HttpContext) {
    const email = await EmailAddress.find(id)

    if (!email) {
      session.flashErrors({ error: "this email doesn't exist" })

      response.redirect().back()
      return
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

      response.redirect().back()
      return
    }

    email.status = EmailAddressStatus.TRASHED
    if (email.$isDirty) await email.save()

    session.flash({
      success: `the email address "${email}" has been trashed !`,
    })

    response.redirect().toRoute('emails.index')
  }
}
