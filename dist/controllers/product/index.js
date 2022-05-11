"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db = require('../../utils/connect');
//insert product
exports.addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = 'INSERT INTO products SET ?';
    console.log(req.body);
    yield db.query(sql, req.body, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("An error occured");
        }
        else {
            res.status(200).send(result);
        }
    });
});
//get all products
exports.getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = 'SELECT * FROM products';
    yield db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(404).send('No Product found');
        }
        res.status(200).send(results);
    });
});
//get one product
exports.getOneProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        console.log(id);
        const sql = `SELECT * FROM products WHERE id=${id}`;
        yield db.query(sql, (err, result) => {
            if (err) {
                res.status(500).send("Something went wrong");
            }
            else {
                console.log(result);
                res.status(200).send(result);
            }
        });
    }
    catch (err) {
        res.status(500).send("Something went wrong");
    }
});
//delete product
exports.deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log(id);
    const sql = `DELETE FROM products WHERE id = ${id}`;
    yield db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Something went wrong");
        }
        else {
            res.status(200).send("Product has been removed");
        }
    });
});
//get products in a category
exports.getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.params;
    console.log(category);
    const sql = `SELECT *
    FROM products
    WHERE categories REGEXP '${category}'`;
    yield db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Something went wrong');
        }
        else {
            res.status(200).send(result);
        }
    });
});
//product search
exports.searchProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.params;
    const sql = `SELECT *
    FROM products
    WHERE description REGEXP '${query}'`;
    yield db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Something went wrong');
        }
        else {
            res.status(200).send(result);
        }
    });
});
//upadate product 
exports.upadateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, price, quantity, description, colors, sizes, categories, image1, image2, image3 } = req.body;
    const sql = `UPDATE products
    SET name = '${name}', price = '${price}', quantity = '${quantity}', description = '${description}', colors = '${colors}', sizes = '${sizes}', categories = '${categories}', image1 = '${image1}', image2 = '${image2}', image3 = '${image3}' WHERE id = ${id}`;
    yield db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Something went wrong');
        }
        else {
            res.status(200).send("Product Updated ");
        }
    });
});
//get random products
exports.getRandomProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = 'SELECT * FROM products ORDER BY RAND() LIMIT 15';
    yield db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(404).send('No Product found');
        }
        res.status(200).send(results);
    });
});
//get random product from categories
exports.getRandomCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.params;
    const sql = `SELECT * FROM products  WHERE categories REGEXP '${category}' ORDER BY RAND() LIMIT 15 `;
    yield db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(404).send('No Product found');
        }
        res.status(200).send(results);
    });
});
