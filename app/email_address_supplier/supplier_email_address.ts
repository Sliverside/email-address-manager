import {
  EmailAddressData,
  EmailAddressDomain,
  EmailAddressName,
  EmailAddressSupplierName,
} from './types.js'

export class SupplierEmailAddress implements EmailAddressData {
  declare name: EmailAddressName
  declare domain: EmailAddressDomain
  declare description: string | null

  constructor(
    data: EmailAddressData,
    readonly supplierName: EmailAddressSupplierName
  ) {
    Object.assign(this, data)
  }

  get [Symbol.toStringTag]() {
    return this.name + '@' + this.domain
  }
}
