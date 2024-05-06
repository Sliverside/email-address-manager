/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { EmailAddressID } from '#models/email_address'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const PermissionDeleteController = () =>
  import('#controllers/user_email_address_permissions/delete_controller')
const EmailsController = () => import('#controllers/email_addresses_controller')
const RegisterController = () => import('#controllers/auth/register_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')
const PermissionsListController = () =>
  import('#controllers/user_email_address_permissions/list_controller')
const PermissionsCreateController = () =>
  import('#controllers/user_email_address_permissions/create_controller')

router.get('/', ({ view }) => view.render('pages/home')).as('home')

router
  .group(() => {
    router
      .group(() => {
        router.get('/register', [RegisterController, 'show']).as('register.show')
        router.post('/register', [RegisterController, 'store']).as('register.store')
        router.get('/login', [LoginController, 'show']).as('login.show')
        router.post('/login', [LoginController, 'store']).as('login.store')
      })
      .use(middleware.guest())

    router.delete('/logout', [LogoutController, 'handle']).as('logout').use(middleware.auth())
  })
  .prefix('auth')
  .as('auth')

router
  .group(() => {
    router.where('id', { cast: (v) => v as EmailAddressID })

    router.get('/', [EmailsController, 'index']).as('index')
    router.get('/create', [EmailsController, 'create']).as('create')
    router.post('/create', [EmailsController, 'store']).as('store')
    router.get('/show/:id', [EmailsController, 'show']).as('show')
    router.get('/edit/:id', [EmailsController, 'edit']).as('edit')
    router.patch('/edit/:id', [EmailsController, 'update']).as('update')
    router.delete('/trash/:id', [EmailsController, 'trash']).as('trash')
  })
  .use(middleware.auth())
  .prefix('emails')
  .as('emails')

router
  .group(() => {
    router.get('/', [PermissionsListController]).as('list')
    router.get('/create', [PermissionsCreateController, 'show']).as('create')
    router.post('/create', [PermissionsCreateController, 'store']).as('store')
    router.delete('/delete', [PermissionDeleteController]).as('delete')
  })
  .use(middleware.auth())
  .prefix('permissions')
  .as('permissions')
