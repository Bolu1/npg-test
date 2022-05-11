"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const jwt = require('jsonwebtoken');
const deserializeUser = (req, res, next) => {
    const accessToken = (0, lodash_1.get)(req, "headers.authorization", "").replace(/^Bearer\s/, "");
    if (!accessToken) {
        return next();
    }
    const decoded = jwt.verify(accessToken, 'Balls');
    console.log("decoded ", decoded);
    if (decoded) {
        res.locals.user = decoded;
        return next();
    }
    next();
};
module.exports = deserializeUser;
