import express from 'express'
const user = require('./user/index')
const group = require('./group/index')
const collection = require('./collection/index')

const routes = express()

routes.use('/user', user)
routes.use('/group', group)
routes.use('/collection', collection)


module.exports = routes