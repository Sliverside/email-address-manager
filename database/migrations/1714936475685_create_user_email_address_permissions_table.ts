import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_email_address_permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('parent_id')
        .unsigned()
        .references('id')
        .inTable(this.tableName)
        .onDelete('CASCADE')
        .nullable()
      table.integer('admin_id').unsigned().references('id').inTable('users').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').notNullable()
      table.string('domain', 255).notNullable()
      table.string('name', 255).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.unique(['admin_id', 'user_id', 'domain', 'name'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
