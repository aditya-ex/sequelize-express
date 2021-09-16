const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const user = require("./user");
const token = sequelize.define("token", {
  token: {
    type: DataTypes.STRING,
  },
});

user.hasOne(token);
token.belongsTo(user);

token.sync();
module.exports = token;
