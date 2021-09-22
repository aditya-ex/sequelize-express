const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const user = sequelize.define("user", {
  username: {
    type: DataTypes.STRING,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
  },
  firstname: {
    type: DataTypes.STRING,
  },
  lastname: {
    type: DataTypes.STRING,
  },
});

user.sync();
module.exports = user;
