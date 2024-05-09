import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Role, { Roles } from './role.js'
import UserEmailAddressPermission from './user_email_address_permission.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roleId: Roles

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column()
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @hasMany(() => UserEmailAddressPermission, { foreignKey: 'adminId' })
  declare ownedEmailAddressPermissions: HasMany<typeof UserEmailAddressPermission>

  @hasMany(() => UserEmailAddressPermission, { foreignKey: 'userId' })
  declare emailAddressPermissions: HasMany<typeof UserEmailAddressPermission>

  isAdmin() {
    return [Roles.SUPER_ADMIN, Roles.ADMIN].includes(this.roleId)
  }

  isSuperAdmin() {
    return this.roleId === Roles.SUPER_ADMIN
  }
}
