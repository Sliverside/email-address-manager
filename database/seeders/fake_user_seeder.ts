import { Roles } from '#models/role'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        id: 1,
        roleId: Roles.SUPER_ADMIN,
        email: 'superadmin@test.local',
        password: 'password',
      },
      {
        id: 2,
        roleId: Roles.ADMIN,
        email: 'admin@test.local',
        password: 'password',
      },
      {
        id: 3,
        roleId: Roles.USER,
        email: 'user@test.local',
        password: 'password',
      },
    ])
  }
}
