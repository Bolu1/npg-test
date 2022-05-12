import express from 'express'
const {begin, get} = require('../../controllers/collection/index')
const isAuth  = require('../../middleware/isAuth')

const router = express()

router.post("/begin", isAuth, begin)
router.get("/get/:id", isAuth, get)
 get
module.exports = router