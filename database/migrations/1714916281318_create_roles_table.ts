import { Roles } from '#models/role'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.string('name', 20).notNullable()
    })

    this.defer(async (db) => {
      await db.table(this.tableName).multiInsert([
        {
          id: Roles.SUPER_ADMIN,
          name: 'Super Admin',
        },
        {
          id: Roles.ADMIN,
          name: 'Admin',
        },
        {
          id: Roles.USER,
          name: 'User',
        },
      ])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
