const User = require("../models/user");

const register = async (req, res) => {
  try {
    let user = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };
    let createdUser = await User.create(user);
    res.send(createdUser);
  } catch (err) {
      console.log(err);
    res.send(err);
  }
};

module.exports = { register };
