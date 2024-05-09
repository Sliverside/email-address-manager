import {
  EmailAddressDoesntExistError,
  EmailAddressSupplierError,
} from '#email_address_supplier/errors'
import { SupplierEmailAddress } from '#email_address_supplier/supplier_email_address'
import type {
  EmailAddressSupplierContract,
  EmailAddressDomain,
  EmailAddressName,
  EmailAddressPassword,
  EmailAddressEditPayload,
  EmailAddressData,
  EmailAddressSupplierName,
  EmailAddressNameAndDomain,
} from '#email_address_supplier/types'
import { ovhRequest } from './api.js'

const supplierName: EmailAddressSupplierName = 'ovh.mxplan'

class OvhEmailAddress extends SupplierEmailAddress {
  constructor(data: EmailAddressData) {
    super(data, supplierName)
  }
}

export class OvhMxplan implements EmailAddressSupplierContract {
  readonly name = supplierName

  async list(): Promise<OvhEmailAddress[]> {
    return this.listDomains()
      .then((domains) => {
        return domains.map((domain) =>
          ovhRequest('GET', `/email/domain/${domain}/account`)
            .then((accounts: string[]) =>
              accounts.map((name) => ({ domain, name: name as EmailAddressName }))
            )
            .then((accounts) => Promise.all(accounts.map((account) => this.get(account))))
        )
      })
      .then(async (a) => {
        const emailAddresses = await Promise.all(a)
        return emailAddresses.flat()
      })
      .catch((error) => {
        let errorMessage = `failed to get email addresses.`
        if (error instanceof EmailAddressSupplierError) errorMessage += ' ' + error.message

        throw new EmailAddressSupplierError(errorMessage)
      })
  }

  async listDomains(): Promise<EmailAddressDomain[]> {
    return ovhRequest('GET', '/email/domain').then((domains: string[]) =>
      domains.map((domain) => domain as EmailAddressDomain)
    )
  }

  async get({
    name,
    domain,
  }: {
    name: EmailAddressName
    domain: EmailAddressDomain
  }): Promise<OvhEmailAddress> {
    return ovhRequest('GET', `/email/domain/${domain}/account/${name}`)
      .then((accountDetail) => {
        return new OvhEmailAddress({
          name,
          domain,
          description: accountDetail.description || null,
          password: null,
        })
      })
      .catch((error) => {
        let errorMessage = `failed to retrieve "${name}@${domain}".`
        if (error instanceof EmailAddressSupplierError) errorMessage += ' ' + error.message

        throw new EmailAddressSupplierError(errorMessage)
      })
  }

  async create({ domain, name, description, password }: Required<EmailAddressData>): Promise<void> {
    return ovhRequest('POST', `/email/domain/${domain}/account`, {
      accountName: name,
      description,
      password,
    }).catch((error) => {
      let errorMessage = `failed to create "${name}@${domain}".`
      if (error instanceof EmailAddressSupplierError) errorMessage += ' ' + error.message

      throw new EmailAddressSupplierError(errorMessage)
    })
  }

  async edit(
    { name, domain }: EmailAddressNameAndDomain,
    data: EmailAddressEditPayload
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const ovhEmailAddress = this.get({ name, domain })

      if (!ovhEmailAddress) {
        reject(new EmailAddressDoesntExistError(`${name}@${domain}`, supplierName))
      }

      if (typeof data.description === 'string') {
        let failed = false

        await ovhRequest('PUT', `/email/domain/${domain}/account/${name}`, {
          description: data.description,
        }).catch((error) => {
          let errorMessage = `failed to update description for "${name}@${domain}".`
          if (error instanceof EmailAddressSupplierError) errorMessage += ' ' + error.message

          reject(new EmailAddressSupplierError(errorMessage))
          failed = true
        })

        if (failed) return
      }

      if (data.password) {
        let failed = false

        await ovhRequest('POST', `/email/domain/${domain}/account/${name}/changePassword`, {
          password: data.password,
        }).catch((error) => {
          let errorMessage = `failed to update password for "${name}@${domain}".`
          if (error instanceof EmailAddressSupplierError) errorMessage += ' ' + error.message

          reject(new EmailAddressSupplierError(errorMessage))
          failed = true
        })

        if (failed) return
      }

      resolve()
    })
  }

  async changePassword(
    { name, domain }: EmailAddressNameAndDomain,
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
    return ovhRequest('DELETE', `/email/domain/${domain}/account/${name}`).catch((error) => {
      let errorMessage = `failed to delete "${name}@${domain}".`
      if (error instanceof EmailAddressSupplierError) errorMessage += ' ' + error.message

      throw new EmailAddressSupplierError(errorMessage)
    })
  }
}
