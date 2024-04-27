/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const EmailsController = () => import('#controllers/email_addresses_controller')
import { EmailAddressID } from '#models/email_address'
import router from '@adonisjs/core/services/router'

router.where('id', { cast: (v) => v as EmailAddressID })

router.get('/', ({ response }) => response.redirect().toRoute('emails'))
router
  .group(() => {
    router.get('/', [EmailsController, 'index']).as('emails')
    router.get('/create', [EmailsController, 'create']).as('emails.create')
    router.post('/create', [EmailsController, 'store']).as('emails.store')
    router.get('/show/:id', [EmailsController, 'show']).as('emails.show')
    router.get('/edit/:id', [EmailsController, 'edit']).as('emails.edit')
    router.post('/edit/:id', [EmailsController, 'update']).as('emails.update')
    router.post('/trash/:id', [EmailsController, 'trash']).as('emails.trash')
  })
  .prefix('emails')
