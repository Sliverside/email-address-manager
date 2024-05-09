import vine from '@vinejs/vine'
import type { FieldContext } from '@vinejs/vine/types'
import validator, { type IsFQDNOptions } from 'validator'

async function domain(value: unknown, options?: IsFQDNOptions, field?: FieldContext) {
  if (typeof value !== 'string') return

  if (!validator.isFQDN(value, options)) {
    field?.report('The {{ field }} field must be a valid domain name', 'emailAddressName', field)
  }
}

export const domainRule = vine.createRule(domain)
