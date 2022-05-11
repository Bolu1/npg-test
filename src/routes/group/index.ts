import express from 'express'
const {create, get, search, join, getMembers, invite, process} = require('../../controllers/group/index')
const validateResult = require('../../middleware/validateResource')
const isAuth  = require('../../middleware/isAuth')

const router = express()

router.post("/create", isAuth, create)
router.get("/get", isAuth, get)
router.get("/search", isAuth, search)
router.get("/join/:group", isAuth, join)
router.get("/getMembers/:group", isAuth, getMembers)
router.post("/invite", isAuth, invite)
router.get("/process", process)

module.exports = router