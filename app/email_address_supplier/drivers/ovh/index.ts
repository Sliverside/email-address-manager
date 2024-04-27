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
import nodeOvh from 'ovh'
import { OvhMxplan } from './mxplan.js'

const supplierName: EmailAddressSupplierName = 'ovh'

const ovhAPI = nodeOvh({
  endpoint: 'ovh-eu',
  appKey: 'a23cc8d7eb22dc14',
  appSecret: '6475dd7e43057ce53b6ee6851e0dccc1',
  consumerKey: 'df3f2e744c2fba02aaaf53f578cad8fc',
  // debug: true,
})

const mxplan = new OvhMxplan(ovhAPI)

// ovhAPI.request(
//   'POST',
//   '/auth/credential',
//   {
//     accessRules: [
//       { method: 'GET', path: '/*' },
//       { method: 'POST', path: '/*' },
//       { method: 'PUT', path: '/*' },
//       { method: 'DELETE', path: '/*' },
//     ],
//   },
//   function (error, credential) {
//     console.log(error || credential)
//   }
// )

export class OvhEmailAddress extends SupplierEmailAddress {
  constructor(data: EmailAddressData) {
    super(data, supplierName)
  }
}

export class Ovh implements EmailAddressSupplierContract {
  readonly name = supplierName
  async list(): Promise<OvhEmailAddress[]> {
    return mxplan.list()
  }

  async get({
    name,
    domain,
  }: {
    name: EmailAddressName
    domain: EmailAddressDomain
  }): Promise<OvhEmailAddress> {
    return mxplan.get({ name, domain })
  }

  async create(payload: Required<EmailAddressData>): Promise<void> {
    return mxplan.create(payload)
  }

  async edit(
    { name, domain }: { name: EmailAddressName; domain: EmailAddressDomain },
    data: EmailAddressEditPayload
  ): Promise<void> {
    return mxplan.edit({ name, domain }, data)
  }

  async changePassword(
    { name, domain }: { name: EmailAddressName; domain: EmailAddressDomain },
    password: EmailAddressPassword
  ): Promise<void> {
    return mxplan.changePassword({ name, domain }, password)
  }

  async delete({
    name,
    domain,
  }: {
    name: EmailAddressName
    domain: EmailAddressDomain
  }): Promise<void> {
    return mxplan.delete({ name, domain })
  }
}
