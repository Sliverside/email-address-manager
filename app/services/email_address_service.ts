import EmailAddress, { EmailAddressStatus } from '#models/email_address'
import { suppliers } from '#email_address_supplier/index'
import { SupplierEmailAddress } from '#email_address_supplier/supplier_email_address'
import {
  EmailAddressData,
  EmailAddressSupplierContract,
  EmailAddressSupplierName,
} from '#email_address_supplier/types'

export default class EmailAddressService {
  static async synchronise() {
    const dbEmails = await EmailAddress.all()
    const supplierEmailAddresses: SupplierEmailAddress[] = []
    const successfullProvidersNames: EmailAddressSupplierName[] = []

    await Promise.allSettled(
      suppliers.map(
        (supplier) =>
          new Promise(async (resolve) => {
            resolve(
              supplier
                .list()
                .then((emails) => {
                  emails.forEach((email) => supplierEmailAddresses.push(email))
                })
                .then(() => successfullProvidersNames.push(supplier.name))
            )
          })
      )
    )

    if (successfullProvidersNames.length === 0) return false

    dbEmails.forEach((dbEmail) => {
      if (
        successfullProvidersNames.includes(dbEmail.supplierName as EmailAddressSupplierName) &&
        dbEmail.status === EmailAddressStatus.ACTIVE
      )
        dbEmail.merge({ status: EmailAddressStatus.ARCHIVED })
    })

    supplierEmailAddresses.forEach((supplierEmailAddress) => {
      const findedDbEmail = dbEmails.find((dbEmail) => {
        if (
          EmailAddressService.uniqueString(supplierEmailAddress) ===
          EmailAddressService.uniqueString(dbEmail)
        )
          return true
      })

      const dbEmail = this.fillFromSupplier(supplierEmailAddress, findedDbEmail)

      if (!findedDbEmail) dbEmails.push(dbEmail)
    })

    await Promise.all(
      dbEmails.map((dbEmail) => {
        if (dbEmail.$isDirty) return dbEmail.save()
      })
    )
  }

  static fillFromSupplier(supplierEmail: SupplierEmailAddress, email?: EmailAddress): EmailAddress {
    if (!email) email = new EmailAddress()
    return email.merge({
      supplierName: supplierEmail.supplierName,
      type: null,
      name: supplierEmail.name,
      domain: supplierEmail.domain,
      description: supplierEmail.description || null,
      status: EmailAddressStatus.ACTIVE,
    })
  }

  static uniqueString(email: { supplierName: string; name: string; domain: string }) {
    return `${email.supplierName}:${email.name}@${email.domain}`
  }

  static getSupplier(
    supplierName: EmailAddressSupplierName
  ): EmailAddressSupplierContract<EmailAddressData> {
    const supplier = suppliers.find((s) => s.name === supplierName)

    if (!supplier) throw new Error("Can't find supplier")

    return supplier
  }
}
