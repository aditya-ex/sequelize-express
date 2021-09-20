const Address = require("../models/address");
const Images = require("../models/images");
const Token = require("../models/token");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function onSuccess(data) {
  let response = {
    error: 0,
    message: "success",
    data: data,
  };
  return response;
}
function onFailure(data){
  let response = {
    error: 1,
    message: data.message || "failure",
    data: data || [],
  };
  return response;
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const register = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    let password = req.body.password;
    let con_password = req.body.con_password;
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
      res.send(
        onSuccess(createdUser)
      );
    } else {
      res.send(onFailure());
    }
  } catch (err) {
    res.send(onFailure(err));
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
        res.send(onSuccess(createdToken));
      } else {
        res.send(onFailure());
      }
    } else {
      res.send(onFailure());
    }
  } catch (err) {
    res.send(onFailure(err));
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
    res.send(onSuccess());
  } catch (err) {
    console.log(err);
    res.send(onFailure(err));
  }
};

const saveAddress = async (req, res) => {
  try {
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
    res.send(onSuccess(createdAddress));
  } catch (err) {
    console.log(err);
    res.send(onFailure(err));
  }
};

const localUpload = async (req, res) => {
  try {
    let user = req.user;
    let image = {
      userId: user.id,
      images: req.file.path,
    };
    let createdImage = await Images.create(image);
    res.send(onSuccess(createdImage));
  } catch (err) {
    res.send(onFailure(err));
  }
};

const uploadOnline = async (req, res) => {
  try {
    console.log(req.files.image);
    let user = req.user;
    let data = req.files.image;
    let image = {
      userId: user.id,
      images: data.tempFilePath,
    };
    await cloudinary.uploader.upload(data.tempFilePath);
    let createdImage = await Images.create(image);
    res.send(onSuccess(createdImage));
  } catch (err) {
    console.log(err);
    res.send(onFailure(err));
  }
};

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) res.send("user doesn't exist");
    let reset_token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
      expiresIn: "600s",
    });
    let token = {
      userId: user.id,
      token: reset_token,
    };
    await Token.create(token);
    const link = `${process.env.BASE_URL}/verify_reset_password/${token.token}`;
    await sendEmail(user.email, "reset password link", link);
    res.send(onSuccess(reset_token));
  } catch (err) {
    console.log(err);
    res.send(onFailure(err));
  }
};

const resetPassword = async (req, res) => {
  let resetToken = req.params.password_reset_token;
  try {
    await jwt.verify(resetToken, process.env.SECRET_KEY);
    let token = await Token.findOne({ where: { token: resetToken } });
    let user = await User.findOne({ where: { id: token.userId } });
    if (token) {
      let password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      let encryptedPassword = await bcrypt.hash(password, salt);
      await User.update(
        { password: encryptedPassword },
        { where: { id: token.userId } }
      );
      await Token.destroy({ where: { token: token.token } });
      await sendEmail(
        user.email,
        "reset password",
        "password reset successfull"
      );
      res.send(onSuccess());
    }else{
      res.send(onFailure());
    }
  } catch (err) {
    console.log(err);
    res.send(onFailure(err));
  }
};

const list = async (req, res) => {
  try {
    let perPage = 10;
    let page = Math.max(0, req.params.page);
    let userList = await User.findAll({
      offset: perPage * (page - 1),
      limit: perPage,
      order: ["username", "ASC"],
    });
    res.send(onSuccess(userList));
  } catch (err) {
    res.send(onFailure(err));
  }
};

module.exports = {
  register,
  login,
  deleteUser,
  saveAddress,
  localUpload,
  uploadOnline,
  forgotPassword,
  resetPassword,
  list,
  onFailure,
  onSuccess,
};
