import {
  EmailAddressAlreadyExistError,
  EmailAddressDoesntExistError,
  EmailAddressProviderError,
} from '../../errors.js'
import type {
  EmailAddressSupplierContract,
  EmailAddressDomain,
  EmailAddressName,
  EmailAddressPassword,
  EmailAddressEditPayload,
  EmailAddressData,
  EmailAddressSupplierName,
} from '../../types.js'
import { OvhEmailAddress } from './index.js'

const supplierName: EmailAddressSupplierName = 'ovh'

export class OvhMxplan implements EmailAddressSupplierContract {
  readonly name = supplierName

  constructor(private ovhAPI: any) {}
  async list(): Promise<OvhEmailAddress[]> {
    return new Promise((resolve) => {
      this.ovhAPI.request(
        'GET',
        '/email/domain/ptigui.li/account',
        async (err: string | number | null, accounts: string[]) => {
          if (err !== null) throw new Error('Error while loading email addresses from OVH API')

          resolve(
            Promise.all(
              accounts.map((name) =>
                this.get({
                  name: name as EmailAddressName,
                  domain: 'ptigui.li' as EmailAddressDomain,
                })
              )
            )
          )
        }
      )
    })
  }

  async get({
    name,
    domain,
  }: {
    name: EmailAddressName
    domain: EmailAddressDomain
  }): Promise<OvhEmailAddress> {
    return new Promise((resolve, reject) => {
      this.ovhAPI.request(
        'GET',
        `/email/domain/${domain}/account/${name}`,
        (err: string | number | null, accountDetail: any) => {
          if (err !== null) {
            reject(new Error('Error while loading email address detail from OVH API'))
          }

          resolve(
            new OvhEmailAddress({
              name,
              domain,
              description: accountDetail.description || null,
            })
          )
        }
      )
    })
  }

  async create({ domain, name, description, password }: Required<EmailAddressData>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ovhAPI.request(
        'POST',
        `/email/domain/${domain}/account`,
        { accountName: name, description, password },
        (err: string | number | null, res: any) => {
          if (err !== null) {
            console.log(err, res)

            let message = 'Error while creating email address from OVH API'

            if (res && typeof res.message === 'string') message += ': ' + res.message

            reject(new EmailAddressProviderError(message))
          } else {
            resolve()
          }
        }
      )
    })
  }

  async edit(
    { name, domain }: { name: EmailAddressName; domain: EmailAddressDomain },
    data: EmailAddressEditPayload
  ): Promise<void> {
    const ovhEmailAddress = this.get({ name, domain })

    if (!ovhEmailAddress) {
      return Promise.reject(new EmailAddressDoesntExistError(`${name}@${domain}`, supplierName))
    }

    if (typeof data.description === 'string') {
      let error: string | number | null = null
      let result: any = null

      await new Promise(() => {
        this.ovhAPI.request(
          'PUT',
          `/email/domain/${domain}/account/${name}`,
          { description: data.description },
          (err: string | number | null, res: any) => {
            error = err
            result = res
          }
        )
      })

      if (error !== null) {
        console.log(error, result)

        return Promise.reject(
          new Error(`failed to update description for "${name}@${domain}", OVH error: ${error}`)
        )
      }
    }

    if (data.password) {
      const error = await new Promise((resolve) => {
        this.ovhAPI.request(
          'POST',
          `/email/domain/${domain}/account/${name}/changePassword`,
          { password: data.password },
          (err: string | number | null) => resolve(err !== null ? err : null)
        )
      })

      if (error !== null) {
        return Promise.reject(
          new Error(`failed to update password for "${name}@${domain}", OVH error: ${error}`)
        )
      }
    }
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
    return new Promise((resolve, reject) => {
      this.ovhAPI.request(
        'DELETE',
        `/email/domain/${domain}/account/${name}`,
        (err: string | number | null) => {
          if (err !== null) {
            reject(Error('Error while deleting email address from OVH API'))
          } else {
            resolve()
          }
        }
      )
    })
  }
}
