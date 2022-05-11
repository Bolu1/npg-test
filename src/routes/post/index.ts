import express from 'express'
const {addEvent, addPost, getEvent, getPost, getOnePost, deletePost} = require('../../controllers/post/index')

const router = express()

router.post('/addEvent', addEvent)
router.post('/addPost', addPost)
router.get('/getEvent', getEvent)
router.get('/getPost', getPost)
router.get('/getOnePost/:id', getOnePost)
router.get('/search')
router.delete('/deletePost/:id', deletePost)
router.post('/deleteEvent/:id', deletePost)
 
module.exports = router