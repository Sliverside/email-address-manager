import type { Opaque } from '@adonisjs/core/types/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type {
  EmailAddressDomain,
  EmailAddressName,
  EmailAddressSupplierName,
} from '#email_address_supplier/types'

export type EmailAddressID = Opaque<'EmailAddressID', string>
export type EmailAddressPassword = Opaque<'EmailPassword', string>

export enum EmailAddressStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  TRASHED = 'trashed',
}

export default class EmailAddress extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: EmailAddressID

  @column()
  declare supplierName: EmailAddressSupplierName

  @column()
  declare type: string | null

  @column()
  declare status: EmailAddressStatus | null

  @column()
  declare name: EmailAddressName

  @column()
  declare domain: EmailAddressDomain

  @column()
  declare password: EmailAddressPassword

  @column()
  declare description: string | null

  get uniqueString() {
    return `${this.supplierName}:${this.name}@${this.domain}`
  }

  get isActive() {
    return this.status === EmailAddressStatus.ACTIVE
  }

  get isArchived() {
    return this.status === EmailAddressStatus.ARCHIVED
  }

  toString() {
    return `${this.name}@${this.domain}`
  }
}
