const colors = require ('colors')
import express,{Request, Response, NextFunction} from 'express'
const bodyParser = require('body-parser')
const logger = require('./utils/logger')
const v1 = require('./routes/index')
const web = require('./routes/web')
const docs = require('./routes/docs')
const cors = require('cors')
const helmet = require('helmet')
const deserializeUser = require ('./middleware/deserializeUser')
const swaggerDocs  = require('./utils/swagger')
const morgan = require('morgan')
const path = require('path')
const mysql = require('mysql') 
 
// taskkill /F /IM node.exe

const app = express() 


app.use(cors())
// app.use(deserializeUser)
app.use(helmet())
app.use(morgan('dev'))

const pool = mysql.createPool({ 
    host : 'us-cdbr-east-05.cleardb.net',
    user : 'b5f8bfe1de3b3f', 
    password : 'fb26353d',
    database : 'heroku_4d7a7ecebc52925'
})

pool.query('select 1 + 1', (err:any, rows:any) => { /* */ });
 

app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: false }))


//main routes
app.use('/v1', v1)
//database routes
app.use('/', web)
// app.use('/db', DB)
app.get('/docs',  (req, res)=>{
    res.sendFile(path.join(__dirname, '../docs.html'))
})
app.use(express.static(__dirname + '/static'))
// startMetricsServer()
app.use((req:Request,res:Response,next:NextFunction)=>{
    const error = new Error('Not Found')
    res.status(404)
    next(error)
})

app.use((error:any ,req:Request,res:Response,next:NextFunction)=>{
   res.status(error.status || 404)
   res.send(error.message)
})

const PORT = process.env.PORT|| 8080

app.listen(PORT, ()=>{
    
    swaggerDocs(app, PORT) 
    logger.info(colors.random(`Application Listening at http://localhost:${PORT}`))
})

module.exports = app
