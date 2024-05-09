import vine from '@vinejs/vine'
import type { FieldContext } from '@vinejs/vine/types'
import validator, { type IsEmailOptions } from 'validator'

/**
 * @param [allow_utf8_local_part] If set to `false`, the validator will not allow any non-English UTF8 character in email address' local part.
 */
type EmailAddressNameOptions = Pick<IsEmailOptions, 'allow_utf8_local_part'>

async function emailAddressName(
  value: unknown,
  options?: EmailAddressNameOptions,
  field?: FieldContext
) {
  if (typeof value !== 'string') return

  if (!validator.isEmail(value + '@domain.com', options)) {
    field?.report(
      'The {{ field }} field must be a valid email address name',
      'emailAddressName',
      field
    )
  }
}

export const emailAddressNameRule = vine.createRule(emailAddressName)
