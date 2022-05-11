const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    // const token = req.body.token;

    let decoded = jwt.verify(token, process.env.SECERET_KEY);

    res.locals.user = {
      email: decoded.email,
      id: decoded.id,
      group: decoded.groupId,
      name: decoded.name
    };
    const main = decoded.email;

    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: err });
  }
};

module.exports = auth;