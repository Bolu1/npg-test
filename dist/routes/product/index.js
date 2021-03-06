"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { addProduct, getProducts, getOneProduct, deleteProduct, getCategory, searchProduct, upadateProduct, getRandomProducts, getRandomCategory } = require('../../controllers/product/index');
const validateResult = require('../../middleware/validateResource');
const { createProductSchema } = require('../../schema/product.schema');
const requireUser = require('../../middleware/requireUser');
const router = (0, express_1.default)();
router.post('/addProduct', validateResult(createProductSchema), addProduct);
router.get('/getProducts', getProducts);
router.get('/getOneProduct/:id', getOneProduct);
router.delete('/deleteProduct/:id', deleteProduct);
router.get('/category/:category', getCategory);
router.get('/search/:query', searchProduct);
router.post('/update', upadateProduct);
router.get('/random', getRandomProducts);
router.get('/randomCategory/:category', getRandomCategory);
module.exports = router;
