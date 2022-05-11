"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user = require('./user/index');
const product = require('./product/index');
const routes = (0, express_1.default)();
/**
 * @openapi
 * /user:
 *     get:
 *         tag:
 *              -userroute
 *              description: Dah
 *              responses:
 *                      200:
 *                          description: App is working
 */
routes.use('/user', user);
routes.use('/product', product);
module.exports = routes;
