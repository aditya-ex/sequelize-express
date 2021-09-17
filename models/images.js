const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const user = require("./user");
const images = sequelize.define("images", {
  images: {
    type: DataTypes.STRING,
  },
});

user.hasMany(images, {foreignKey: "userId",as: "images"});
images.sync();
module.exports = images;
