import { EmailAddressDoesntExistError, EmailAddressSupplierError } from '../../errors.js'
import { SupplierEmailAddress } from '../../supplier_email_address.js'
import type {
  EmailAddressSupplierContract,
  EmailAddressDomain,
  EmailAddressName,
  EmailAddressPassword,
  EmailAddressEditPayload,
  EmailAddressData,
  EmailAddressSupplierName,
} from '../../types.js'
import { ovhRequest } from './api.js'

const supplierName: EmailAddressSupplierName = 'ovh.exchange'

class OvhEmailAddress extends SupplierEmailAddress {
  constructor(data: EmailAddressData) {
    super(data, supplierName)
  }
}

export class OvhExchange implements EmailAddressSupplierContract {
  readonly name = supplierName

  async list(): Promise<OvhEmailAddress[]> {
    return []
    // return ovhRequest('GET', '/email/domain')
    //   .then((domains: string[]) => {
    //     return domains.map((domain) =>
    //       ovhRequest('GET', `/email/domain/${domain}/account`)
    //         .then((accounts: string[]) =>
    //           accounts.map((name) => ({
    //             domain: domain as EmailAddressDomain,
    //             name: name as EmailAddressName,
    //           }))
    //         )
    //         .then((accounts) => Promise.all(accounts.map((account) => this.get(account))))
    //     )
    //   })
    //   .then(async (a) => {
    //     const emailAddresses = await Promise.all(a)
    //     return emailAddresses.flat()
    //   })
    //   .catch((error) => {
    //     let errorMessage = `failed to get email addresses.`
    //     if (error instanceof EmailAddressSupplierError) errorMessage += ' ' + error.message

    //     throw new EmailAddressSupplierError(errorMessage)
    //   })
  }

  listDomains(): Promise<EmailAddressDomain[]> {
    throw new Error('Method not implemented.')
  }

  async get({
    name,
    domain,
  }: {
    name: EmailAddressName
    domain: EmailAddressDomain
  }): Promise<OvhEmailAddress> {
    name && domain
    throw new Error('method not implemented yet')
    // return ovhRequest('GET', `/email/domain/${domain}/account/${name}`)
    //   .then((accountDetail) => {
    //     return new OvhEmailAddress({
    //       name,
    //       domain,
    //       description: accountDetail.description || null,
    //     })
    //   })
    //   .catch((error) => {
    //     let errorMessage = `failed to retrieve "${name}@${domain}".`
    //     if (error instanceof EmailAddressSupplierError) errorMessage += ' ' + error.message

    //     throw new EmailAddressSupplierError(errorMessage)
    //   })
  }

  async create({ domain, name, description, password }: Required<EmailAddressData>): Promise<void> {
    name && domain && description && password
    throw new Error('method not implemented yet')
    // return ovhRequest('POST', `/email/domain/${domain}/account`, {
    //   accountName: name,
    //   description,
    //   password,
    // }).catch((error) => {
    //   let errorMessage = `failed to create "${name}@${domain}".`
    //   if (error instanceof EmailAddressSupplierError) errorMessage += ' ' + error.message

    //   throw new EmailAddressSupplierError(errorMessage)
    // })
  }

  async edit(
    { name, domain }: { name: EmailAddressName; domain: EmailAddressDomain },
    data: EmailAddressEditPayload
  ): Promise<void> {
    name && domain && data
    throw new Error('method not implemented yet')
    // return new Promise(async (resolve, reject) => {
    //   const ovhEmailAddress = this.get({ name, domain })

    //   if (!ovhEmailAddress) {
    //     reject(new EmailAddressDoesntExistError(`${name}@${domain}`, supplierName))
    //   }

    //   if (typeof data.description === 'string') {
    //     let failed = false

    //     await ovhRequest('PUT', `/email/domain/${domain}/account/${name}`, {
    //       description: data.description,
    //     }).catch((error) => {
    //       let errorMessage = `failed to update description for "${name}@${domain}".`
    //       if (error instanceof EmailAddressSupplierError) errorMessage += ' ' + error.message

    //       reject(new EmailAddressSupplierError(errorMessage))
    //       failed = true
    //     })

    //     if (failed) return
    //   }

    //   if (data.password) {
    //     let failed = false

    //     await ovhRequest('POST', `/email/domain/${domain}/account/${name}/changePassword`, {
    //       password: data.password,
    //     }).catch((error) => {
    //       let errorMessage = `failed to update password for "${name}@${domain}".`
    //       if (error instanceof EmailAddressSupplierError) errorMessage += ' ' + error.message

    //       reject(new EmailAddressSupplierError(errorMessage))
    //       failed = true
    //     })

    //     if (failed) return
    //   }

    //   resolve()
    // })
  }

  async changePassword(
    { name, domain }: { name: EmailAddressName; domain: EmailAddressDomain },
    password: EmailAddressPassword
  ): Promise<void> {
    return this.edit({ name, domain }, { password })
  }

  async delete({
    name,
    domain,
  }: {
    name: EmailAddressName
    domain: EmailAddressDomain
  }): Promise<void> {
    name && domain
    throw new Error('method not implemented yet')
    // return ovhRequest('DELETE', `/email/domain/${domain}/account/${name}`).catch((error) => {
    //   let errorMessage = `failed to delete "${name}@${domain}".`
    //   if (error instanceof EmailAddressSupplierError) errorMessage += ' ' + error.message

    //   throw new EmailAddressSupplierError(errorMessage)
    // })
  }
}
