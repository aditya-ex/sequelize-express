const Token = require("../models/token");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authentication = async (req, res, next) => {
  let headerToken = req.headers.access_token;
  if (headerToken) {
    try {
      await jwt.verify(headerToken, process.env.SECRET_KEY);
      const token = await Token.findOne({ where: { token: headerToken } });
      const user = await User.findOne({ where: { id: token.userId } });
      req.user = user;
      next();
    } catch (err) {
      console.log(err);
      res.send({
        error: 1,
        message: err.message || "an error occured",
        data: err,
      });
    }
  } else {
    return res.send("no token provided");
  }
};

module.exports = authentication;