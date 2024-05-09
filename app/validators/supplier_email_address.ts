import { EmailAddressPassword } from '#models/email_address'
import vine from '@vinejs/vine'
import { suppliersNames } from '#email_address_supplier/index'
import {
  EmailAddressDomain,
  EmailAddressName,
  EmailAddressSupplierName,
} from '#email_address_supplier/types'

vine.convertEmptyStringsToNull = true

export const createSupplierEmailValidator = vine.compile(
  vine.object({
    password: vine
      .string()
      .minLength(8)
      .maxLength(20)
      .trim()
      .transform((v) => v as EmailAddressPassword),

    description: vine
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? v : null) as string | null),

    supplierName: vine
      .string()
      .in(suppliersNames)
      .transform((v) => v as EmailAddressSupplierName),

    type: vine
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? v : null) as string | null),

    name: vine
      .string()
      .trim()
      .toLowerCase()
      .transform((v) => v as EmailAddressName),

    domain: vine
      .string()
      .trim()
      .toLowerCase()
      .transform((v) => v as EmailAddressDomain),
  })
)
