const Sequelize = require("sequelize");
const sequelize = new Sequelize("postgres", "postgres", "12345", {
  host: process.env.HOSTS,
  dialect: "postgres",
  define: {
    timestamps: false,
  },
});

(async () => {
    try {
      await sequelize.authenticate();
      console.log("connect to database");
    } catch (err) {
      console.log("an error occurred: ", err);
    }
  })();

module.exports = sequelize;