import type { EmailAddressNameAndDomain } from '#email_address_supplier/types'
import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class EmailAddressPolicy extends BasePolicy {
  show(user: User, emailAddress: EmailAddressNameAndDomain): AuthorizerResponse {
    return this.any(user, emailAddress)
  }
  create(user: User): AuthorizerResponse {
    if (user.isSuperAdmin()) return true

    const canCreate = user
      .related('EmailAddressPermissions')
      .query()
      .first()
      .then((v) => v !== null)

    return canCreate
  }
  store(user: User, emailAddress: EmailAddressNameAndDomain): AuthorizerResponse {
    return this.any(user, emailAddress)
  }
  edit(user: User, emailAddress: EmailAddressNameAndDomain): AuthorizerResponse {
    return this.any(user, emailAddress)
  }
  update(user: User, emailAddress: EmailAddressNameAndDomain): AuthorizerResponse {
    return this.any(user, emailAddress)
  }
  delete(user: User, emailAddress: EmailAddressNameAndDomain): AuthorizerResponse {
    return this.any(user, emailAddress)
  }
  private async any(user: User, emailAddress: EmailAddressNameAndDomain): Promise<boolean> {
    if (user.isSuperAdmin()) return true

    const permission = await user
      .related('EmailAddressPermissions')
      .query()
      .where('domain', emailAddress.domain)
      .andWhere((builder) => {
        builder.where('name', '*').orWhere('name', emailAddress.name)
      })
      .first()

    return permission !== null
  }
}
