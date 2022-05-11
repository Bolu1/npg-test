"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const log = require('./logger');
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'Rest api docs',
            version: "4>"
        },
        components: {
            securityShemas: {
                bearerAuth: {
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
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const swaggerDocs = (app, port) => {
    app.use('/doc', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    app.get('doc.json', (req, res) => {
        res.setHeader('Content-Type', "application/json");
        res.send(swaggerSpec);
    });
    log.info(`Docs available at http://localhost:${port}/doc`);
};
module.exports = swaggerDocs;
