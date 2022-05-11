import {Express, Request, Response} from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
const log = require('./logger')

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info:{
            title: 'Rest api docs',
            version:"4>"
        },
        components:{
            securityShemas:{
                bearerAuth:{
                    type: 'http',
                    schema: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ]
    },
    apis: ["../src/routes/index.ts", "./src/routes/product/index.ts"]
}

const swaggerSpec = swaggerJsdoc(options)

const swaggerDocs = (app: Express, port: number) => {

    app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    app.get('doc.json', (req:Request, res:Response) =>{
        res.setHeader('Content-Type', "application/json")
        res.send(swaggerSpec)
    })

    log.info(`Docs available at http://localhost:${port}/doc`)
}

module.exports = swaggerDocs