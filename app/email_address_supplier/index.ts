import { Fake } from './drivers/fake.js'
import { Ovh } from './drivers/ovh/index.js'
import { EmailAddressSupplierContract, EmailAddressSupplierName } from './types.js'

export const suppliers: EmailAddressSupplierContract[] = [new Fake(), new Ovh()]
export const suppliersNames: EmailAddressSupplierName[] = ['fake', 'ovh'] as const
