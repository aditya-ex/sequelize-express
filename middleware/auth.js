const Token = require("../models/token");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const users = require("../controllers/users");
require("dotenv").config();

const authentication = async (req, res, next) => {
  let headerToken = req.headers.access_token;
  if (headerToken) {
    try {
      await jwt.verify(headerToken, process.env.SECRET_KEY);
      const token = await Token.findOne({ where: { token: headerToken } });
      req.user = token;
      next();
    } catch (err) {
      res.send(users.onFailure(err));
    }
  } else {
    res.send(users.onFailure());
  }
};

module.exports = authentication;
