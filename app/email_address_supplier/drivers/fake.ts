import { SupplierEmailAddress } from '../supplier_email_address.js'
import { EmailAddressAlreadyExistError, EmailAddressDoesntExistError } from '../errors.js'
import type {
  EmailAddressSupplierContract,
  EmailAddressDomain,
  EmailAddressName,
  EmailAddressPassword,
  EmailAddressEditPayload,
  EmailAddressData,
  EmailAddressSupplierName,
} from '../types.js'

const supplierName: EmailAddressSupplierName = 'fake'

interface FakeSupplierEmailAddress {
  name: string
  domain: string
  password: string
  description: string | null
}

class FakeEmailAddress extends SupplierEmailAddress {
  constructor(data: EmailAddressData) {
    super(data, supplierName)
  }
}

const fakeEmailAddresses: FakeSupplierEmailAddress[] = []

const emailAddresses: Map<string, FakeSupplierEmailAddress> = new Map(
  fakeEmailAddresses.map((e) => {
    return [e.name + '@' + e.domain, e]
  })
)

export class Fake implements EmailAddressSupplierContract {
  async listDomains(): Promise<EmailAddressDomain[]> {
    return ['fake.test', 'test.fake', 'example.com', 'exemple.fr'].map(
      (d) => d as EmailAddressDomain
    )
  }
  readonly name = supplierName
  async list(): Promise<FakeEmailAddress[]> {
    return Array.from(emailAddresses.values()).map(({ name, domain, description }) => {
      return new FakeEmailAddress({
        name: name as EmailAddressName,
        domain: domain as EmailAddressDomain,
        description: description,
      })
    })
  }

  async get({
    name,
    domain,
  }: {
    name: EmailAddressName
    domain: EmailAddressDomain
  }): Promise<FakeEmailAddress> {
    const fakeEmailAddress = Array.from(emailAddresses.values()).find((e) => {
      return e.name === name && e.domain === domain
    })

    if (!fakeEmailAddress) {
      return Promise.reject(new EmailAddressDoesntExistError(`${name}@${domain}`, supplierName))
    }

    return new FakeEmailAddress({
      name: fakeEmailAddress.name as EmailAddressName,
      domain: fakeEmailAddress.domain as EmailAddressDomain,
      description: fakeEmailAddress.description,
    })
  }

  async create(payload: Required<EmailAddressData>): Promise<void> {
    const stringified = payload.name + '@' + payload.domain

    if (emailAddresses.has(stringified)) {
      return Promise.reject(new EmailAddressAlreadyExistError(stringified, supplierName))
    }

    emailAddresses.set(stringified, payload)
  }

  async edit(
    { name, domain }: { name: EmailAddressName; domain: EmailAddressDomain },
    data: EmailAddressEditPayload
  ): Promise<void> {
    const fakeEmailAddress = Array.from(emailAddresses.values()).find((e) => {
      return e.name === name && e.domain === domain
    })

    if (!fakeEmailAddress) {
      return Promise.reject(new EmailAddressDoesntExistError(`${name}@${domain}`, supplierName))
    }

    if (data.description) fakeEmailAddress.description = data.description
    if (data.password) fakeEmailAddress.password = data.password
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
    const stringified = name + '@' + domain
    if (!emailAddresses.delete(stringified)) {
      return Promise.reject(new EmailAddressDoesntExistError(`${name}@${domain}`, supplierName))
    }
  }
}
