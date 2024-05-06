import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class UserEmailAddressPermission extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare parentId: number

  @column()
  declare adminId: number

  @column()
  declare userId: number

  @column()
  declare domain: string

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => UserEmailAddressPermission)
  declare parent: BelongsTo<typeof UserEmailAddressPermission>

  @belongsTo(() => User)
  declare admin: BelongsTo<typeof User>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
