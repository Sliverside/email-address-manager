import { EmailAddressPassword } from '#models/email_address'
import vine from '@vinejs/vine'
import { suppliersNames } from '#email_address_supplier/index'
import {
  EmailAddressDomain,
  EmailAddressName,
  EmailAddressSupplierName,
} from '#email_address_supplier/types'

vine.convertEmptyStringsToNull = true

export const createEmailValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .trim()
      .transform((v) => {
        const splittedEmail = v.split('@')
        return {
          name: splittedEmail[0] as EmailAddressName,
          domain: splittedEmail[1] as EmailAddressDomain,
        }
      }),

    password: vine
      .string()
      .minLength(8)
      .maxLength(20)
      .trim()
      .transform((v) => v as EmailAddressPassword),

    description: vine.string().trim().optional(),

    supplierName: vine
      .string()
      .in(suppliersNames)
      .transform((v) => v as EmailAddressSupplierName),

    type: vine.string().trim().optional(),
  })
)

export const updateEmailValidator = vine.compile(
  vine.object({
    password: vine
      .string()
      .minLength(8)
      .maxLength(20)
      .trim()
      .transform((v) => v as EmailAddressPassword)
      .optional(),

    description: vine.string().trim().nullable(),
    type: vine.string().trim().optional(),
  })
)
