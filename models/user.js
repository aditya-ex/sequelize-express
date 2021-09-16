const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const user = sequelize.define("user", {
  username: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
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
