import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'email_addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('supplier_name').notNullable()
      table.string('type', 255).nullable()
      table.enum('status', ['active', 'archived', 'trashed']).defaultTo('active').notNullable()
      table.string('name', 255).notNullable()
      table.string('domain', 255).notNullable()
      table.string('password', 255).nullable()
      table.string('description', 255).nullable()

      table.unique(['supplier_name', 'name', 'domain'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
