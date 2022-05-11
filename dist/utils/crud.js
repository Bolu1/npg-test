"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
const colors_1 = __importDefault(require("colors"));
const db = require('./connect');
// create database
router.get('/createdb', (req, res) => {
    const sql = 'CREATE DATABASE bluesprint-erp';
    db.query(sql, (err, result) => {
        if (err)
            throw err;
        console.log(colors_1.default.red(result));
        res.send('database created...');
    });
});
// cretate table
router.get('/createtb', (req, res) => {
    const sql = 'CREATE TABLE employee(id int AUTO_INCREMENT, email VARCHAR(255), password VARCHAR(255), firstname VARCHAR(50), lastname VARCHAR(50), othernames VARCHAR(50), PRIMARY KEY (id)) ';
    db.query(sql, (err, result) => {
        if (err)
            throw err;
        console.log(result);
        res.send('employee table created...');
    });
});
// Add user
router.get('/adduser', (req, res) => {
    const post = {
        email: 'test2',
        password: 'test2',
        confirmed: false,
        type: 'student'
    };
    const sql = 'INSERT INTO employee SET ?';
    const query = db.query(sql, post, (err, result) => {
        if (err)
            throw err;
        console.log(result);
        res.send("User added...");
    });
});
// Get employee
router.get('/getemployees', (req, res) => {
    const sql = 'SELECT * FROM employee';
    const query = db.query(sql, (err, results) => {
        if (err)
            throw err;
        console.log(results);
        res.status(200).json(results);
    });
});
// Get one User
router.get('/getoneuser/:id', (req, res) => {
    const sql = `SELECT * FROM employee WHERE id = ${req.params.id}`;
    const query = db.query(sql, (err, result) => {
        if (err) {
            res.status(404).send('Not found');
        }
        console.log(result);
        res.status(200).send(result);
    });
});
// Update User
router.get('/updateuser/:id', (req, res) => {
    const confirmed = true;
    const sql = `UPDATE employee SET confirmed = ${confirmed} WHERE id = ${req.params.id}`;
    const query = db.query(sql, (err, result) => {
        if (err)
            throw err;
        console.log(result);
        res.send("employee updated");
    });
});
// Delete Post
router.get('/deleteuser/:id', (req, res) => {
    const type = 'student';
    const sql = `DELETE FROM employee WHERE type = ${type}`;
    const query = db.query(sql, (err, result) => {
        if (err)
            throw err;
        console.log(result);
        res.send(result);
    });
});
module.exports = router;
