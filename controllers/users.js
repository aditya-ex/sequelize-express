const User = require("../models/user");
const Token = require("../models/token");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { send } = require("process");
const sendEmail = require("../utils/sendEmail");

const register = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    password = req.body.password;
    con_password = req.body.con_password;
    if (password == con_password) {
      let secretPassword = await bcrypt.hash(password, salt);
      let user = {
        username: req.body.username,
        email: req.body.email,
        password: secretPassword,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      };
      let createdUser = await User.create(user);
      await sendEmail(
        user.email,
        "registration",
        "user regitered successfully"
      );
      res.send({
        error: 0,
        message: "user created successfully",
        data: createdUser,
      });
    } else {
      res.send("password don't match");
    }
  } catch (err) {
    res.send({
      error: 1,
      message: err.message || "failed to save new user",
      data: err,
    });
  }
};

const login = async (req, res) => {
  let user = await User.findOne({ where: { username: req.body.username } });
  try {
    if (user) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (validPassword) {
        let access_token = jwt.sign(
          {
            userId: user.id,
          },
          process.env.SECRET_KEY,
          { expiresIn: "1h" }
        );
        console.log(access_token);
        let token = {
          token: access_token,
        };
        let createdToken = await Token.create(token);
        res.send({
          error: 0,
          message: "token sent successfully",
          data: createdToken,
        });
      } else {
        res.send({
          error: 1,
          message: "password don't match",
          data: [],
        });
      }
    } else {
      res.send({
        error: 1,
        message: "user not found",
        data: [],
      });
    }
  } catch (err) {
    res.send({
      error: 1,
      message: err.message || "failed to send token",
    });
    console.log(err);
  }
};

module.exports = { register, login };
