import { Fake } from './drivers/fake.js'
import { OvhMxplan } from './drivers/ovh/mxplan.js'
// import { OvhPro } from './drivers/ovh/pro.js'
// import { OvhExchange } from './drivers/ovh/exchange.js'
import { EmailAddressSupplierContract, EmailAddressSupplierName } from './types.js'

export const suppliers: EmailAddressSupplierContract[] = [
  new Fake(),
  new OvhMxplan(),
  // new OvhPro(),
  // new OvhExchange(),
]

export const suppliersNames: EmailAddressSupplierName[] = [
  'fake',
  'ovh.mxplan',
  // 'ovh.pro',
  // 'ovh.exchange',
] as const
