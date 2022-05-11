"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { addUser, signin, getUsers, confirmation, forgotPassword, confirmPassword } = require('../../../controllers/user/auth');
const validateResult = require('../../../middleware/validateResource');
const { createUserSchema, signinSchema } = require('../../../schema/user.schema');
const requireUser = require('../../../middleware/requireUser');
const router = (0, express_1.default)();
router.post('/signup', validateResult(createUserSchema), addUser);
router.post('/signin', validateResult(signinSchema), signin);
router.get('/getUsers', getUsers);
router.get('/confirmation/:token', confirmation);
router.post('/forgotPassword', forgotPassword);
router.post('/confirmPassword', confirmPassword);
module.exports = router;
