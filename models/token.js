const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const user = require("./user");
const token = sequelize.define("token", {
  token: {
    type: DataTypes.STRING,
  },
});

user.hasMany(token, {foreignKey: "userId", as: "token" });

token.sync();
module.exports = token;
