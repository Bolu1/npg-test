"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const express_1 = __importDefault(require("express"));
const bodyParser = require('body-parser');
const logger = require('./utils/logger');
const v1 = require('./routes/index');
const web = require('./routes/web');
const docs = require('./routes/docs');
const cors = require('cors');
const sql = require('./utils/connect');
// const DB = require('./utils/crud')
const helmet = require('helmet');
const deserializeUser = require('./middleware/deserializeUser');
// const {startMetricsServer} = require('../src/utils/metrics')
const swaggerDocs = require('./utils/swagger');
const morgan = require('morgan');
const path = require('path');
const app = (0, express_1.default)();
app.use(cors());
app.use(deserializeUser);
app.use(helmet());
app.use(morgan('dev'));
sql.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("db connected");
});
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json())
// app.use(express.urlencoded({extended: true}))
//main routes
app.use('/v1', v1);
//database routes
app.use('/', web);
// app.use('/db', DB)
app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, '../docs.html'));
});
app.use(express_1.default.static(__dirname + '/static'));
// startMetricsServer()
app.use((req, res, next) => {
    const error = new Error('Not Found');
    res.status(404);
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 404);
    res.send(error.message);
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    swaggerDocs(app, PORT);
    logger.info(colors.random(`Application Listening at http://localhost:${PORT}`));
});
module.exports = app;
