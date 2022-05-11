"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user = require('./user/index');
const product = require('./product/index');
const routes = (0, express_1.default)();
routes.get('/', (req, res) => {
    res.send("Welcome");
});
module.exports = routes;
