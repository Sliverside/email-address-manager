import type { Opaque } from '@adonisjs/core/types/helpers'
import { SupplierEmailAddress } from './supplier_email_address.js'

export type EmailAddressSupplierName = 'fake' | 'ovh.mxplan' | 'ovh.pro' | 'ovh.exchange'
export type EmailAddressName = Opaque<'EmailName', string>
export type EmailAddressDomain = Opaque<'EmailDomain', string>
export type EmailAddressPassword = Opaque<'EmailPassword', string>

export interface EmailAddressData {
  name: EmailAddressName
  domain: EmailAddressDomain
  description: string | null
  password?: EmailAddressPassword
}

export type EmailAddressEditPayload<Data extends EmailAddressData = EmailAddressData> = Partial<
  Omit<Data, 'name' | 'domain' | 'status'>
>

export interface EmailAddressSupplierContract<Data extends EmailAddressData = EmailAddressData> {
  readonly name: EmailAddressSupplierName
  list(): Promise<SupplierEmailAddress[]>
  listDomains(): Promise<EmailAddressDomain[]>
  get({
    name,
    domain,
  }: {
    name: EmailAddressName
    domain: EmailAddressDomain
  }): Promise<SupplierEmailAddress>
  create(payload: Required<Data>): Promise<void>
  edit(
    { name, domain }: { name: EmailAddressName; domain: EmailAddressDomain },
    data: EmailAddressEditPayload<Data>
  ): Promise<void>
  changePassword(
    { name, domain }: { name: EmailAddressName; domain: EmailAddressDomain },
    password: EmailAddressPassword
  ): Promise<void>
  delete({ name, domain }: { name: EmailAddressName; domain: EmailAddressDomain }): Promise<void>
}
