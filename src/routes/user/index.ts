import express from 'express'
const authRouter = require ('./modules/auth')

const userRoutes = express.Router()

userRoutes.use('/auth', authRouter)

module.exports = userRoutes