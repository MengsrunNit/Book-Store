const Sequelize = require("sequelize");

const sequelize = new Sequelize("my_new_db", "root", "Mengsrun2@7", {
  host: "127.0.0.1",
  dialect: "mysql",
});

module.exports = sequelize;
