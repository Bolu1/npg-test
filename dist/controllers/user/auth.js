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
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../utils/connect');
const transporter = require('../../utils/mailer');
// confirmation
exports.confirmation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = jwt.verify(req.params.token, process.env.SECERET_KEY);
        const confirmed = true;
        const sql = `UPDATE users SET confirmed = ${confirmed} WHERE email = '${email}'`;
        const query = db.query(sql, (err, result) => {
            if (err)
                throw err;
            console.log(result);
            res.status(200).send("Users updated");
        });
    }
    catch (e) {
        res.status(500).send('The Link has expired');
    }
});
//addUser
exports.addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //destructure body
    const { email, password, confirmPassword, firstname, lastname, phone } = req.body;
    //hash password
    const hashedPassword = yield bcrypt.hash(password, 12);
    //payload to the database
    const post = {
        email: email,
        password: hashedPassword,
        firstname: firstname,
        lastname: lastname,
        phone: phone,
        confirmed: false
    };
    //check if user exists
    const sqll = `INSERT INTO users SET ?`;
    const sql = `SELECT * FROM users WHERE email = '${email}'`;
    const query = yield db.query(sql, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            throw err;
        if (result[40]) {
            return res.status(409).send('User already exists');
        }
        else {
            const results = yield db.query(sqll, post, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log(err);
                    return res.status(400).send('something went wrong');
                }
                try {
                    // send verification mail with signed token
                    const emailToken = jwt.sign({ email: email }, process.env.SECERET_KEY, { expiresIn: "1d" });
                    const url = `http://localhost:${process.env.PORT}/v1/user/auth/confirmation/${emailToken}`;
                    yield transporter.sendMail({
                        to: email,
                        subject: 'Confirm Email',
                        html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
                    });
                    res.status(200).send('User added successfully');
                }
                catch (err) {
                    console.log(err);
                    res.status(500).send("sometyhing went wrong");
                }
            }));
        }
    }));
});
exports.signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("res ", res.locals.user);
    const { email, password } = req.body;
    var valid;
    //check if user exists
    const sql = `SELECT * FROM users WHERE email = '${email}'`;
    try {
        const query = yield db.query(sql, (err, result) => {
            if (err)
                throw err;
            const { email, id, confirmed, type } = result[0];
            const pass = result[0].password;
            if (!result.length) {
                return res.status(400).send('Invalid login parameters');
            }
            //signin the user
            const fetch = () => __awaiter(void 0, void 0, void 0, function* () {
                valid = yield bcrypt.compare(password, pass);
                if (!valid) {
                    return res.status(400).send('Invalid login parameters');
                }
                const token = jwt.sign({ email: email, id: id, type: type }, process.env.SECERET_KEY, { expiresIn: "1h" });
                res.status(200).json(token);
            });
            fetch();
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});
exports.getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = 'SELECT * FROM users';
    const query = db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(404).send('No user found');
        }
        res.status(200).send(results);
    });
});
exports.forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const sql = `SELECT * FROM users WHERE email = '${email}'`;
    yield db.query(sql, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            res.status(500).send("Something went wrong");
        }
        else {
            if (!result.length) {
                res.send(409).send("This email is not valid");
            }
            else {
                try {
                    // send verification mail with signed token
                    const emailToken = jwt.sign({ email: email }, process.env.SECERET_KEY, { expiresIn: "1d" });
                    const url = `http://localhost:${process.env.PORT}/v1/user/auth/resetPassword/${emailToken}`;
                    yield transporter.sendMail({
                        to: email,
                        subject: 'Confirm Email',
                        html: `Please click this link to reset your password: <a href="${url}">${url}</a>`,
                    });
                    res.status(200).send('Sent mail');
                }
                catch (err) {
                    console.log(err);
                    res.status(500).send("sometyhing went wrong");
                }
            }
        }
    }));
});
exports.confirmPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = jwt.verify(req.body.token, process.env.SECERET_KEY);
        const { password } = req.body;
        const hashedPassword = yield bcrypt.hash(password, 12);
        const sql = `UPDATE users SET password = ${hashedPassword} WHERE email = '${email}'`;
        const query = db.query(sql, (err, result) => {
            if (err)
                throw err;
            console.log(result);
            res.status(200).send("Users updated");
        });
    }
    catch (e) {
        res.status(500).send('The Link has expired');
    }
});
