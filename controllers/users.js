const Address = require("../models/address");
const Images = require("../models/images");
const Token = require("../models/token");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const { send } = require("process");
const { createTransport } = require("nodemailer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

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
        let token = {
          userId: user.id,
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

const deleteUser = async (req, res) => {
  try {
    let user = req.user;
    await User.destroy({ where: { id: user.id } });
    await Token.destroy({ where: { userId: user.id } });
    await Address.destroy({ where: { userId: user.id } });
    await Images.destroy({ where: { userId: user.id } });
    res.send({
      error: 0,
      message: "data deleted successfully",
      data: [],
    });
  } catch (err) {
    console.log(err);
    res.send({
      error: 1,
      message: err.message || "failed to delete data",
      data: err,
    });
  }
};

const saveAddress = async (req, res) => {
  try{
    let user = req.user;
    let address = {
      userId: user.id,
      address: req.body.address,
      state: req.body.state,
      city: req.body.city,
      pin_code: req.body.pin_code,
      phone_no: req.body.phone_no, 
    };
    let createdAddress = await Address.create(address);
    res.send({
      error:0,
      message: "address saved successfully",
      data: createdAddress,
    });
  }catch(err){
    console.log(err);
    res.send({
      error: 1,
      message: err.message || "failed to save address",
      data: err,
    });
  }
};

const localUpload = async (req, res) =>{
  try {
    let user = req.user;
    let image = {
      userId: user.id,
      images: req.file.path,
    };
    let createdImage = await Images.create(image);
    res.send({
      error: 0,
      message: "image saved successfully",
      data: createdImage,
    });
  }catch(err){
    res.send({
      error: 0,
      message: err.message || "failed to save image",
      data: err,
    });
  }
};

const uploadOnline = async (req, res) => {
  try{
    let user = req.user;
    let data = req.files.image;
    let image = {
      userId: user.id,
      images: data,
    };
    let createdImage = await Images.create(image);
    await cloudinary.uploader.upload(data.tempFilePath);
    res.send({
      error: 0,
      message: "image saved successfully",
      data: createdImage,
    });
  }catch(err){
    res.send({
      error: 1,
      message: err.message || "failed to saved image",
      data: err,
    });
  }
};

module.exports = { register, login, deleteUser, saveAddress, localUpload, uploadOnline};
