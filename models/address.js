const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const user = require("./user");
const address = sequelize.define("address", {
  address: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  },
  phone_no: {
    type: DataTypes.INTEGER,
  },
  pin_code: {
    type: DataTypes.INTEGER,
  },
});

user.hasMany(address, {foreignKey:"userId", as: "address"});
address.sync();

module.exports = address;
