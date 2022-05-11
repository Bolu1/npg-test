// import express from 'express'
// import client from 'prom-client'
// const log = require('./logger')


// const app = express()

// exports.startMetricsServer = () =>{

//     const collectDefaultMetrics = client.collectDefaultMetrics

//     collectDefaultMetrics()

//     app.get('/metrics', async(req, res) =>{

//         res.set("Content-Type", client.register.contentType)
//         return res.send(await client.register.metrics())
//     })
//     app.listen(9100, ()=>{
//         log.info(`metrics server started at http://localhost:9100`)
//     })

// }