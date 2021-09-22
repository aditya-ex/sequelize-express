const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const user = require("./user");
const images = sequelize.define("images", {
  imageURL: {
    type: DataTypes.STRING,
  },
  images: {
    type: DataTypes.BLOB,
  }
});

user.hasMany(images, {foreignKey: "userId",as: "images"});
images.sync();
module.exports = images;
