import emitter from '@adonisjs/core/services/emitter'
import db from '@adonisjs/lucid/services/db'
import logger from '@adonisjs/core/services/logger'
import app from '@adonisjs/core/services/app'

emitter.on('db:query', (query) => {
  if (app.inProduction) {
    logger.debug(query)
  } else {
    db.prettyPrint(query)
  }
})
