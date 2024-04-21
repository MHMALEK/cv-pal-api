const Sequelize = require("sequelize");

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db/app.db",
});

const User = sequelize.define("User", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  UserName: {
    type: Sequelize.INTEGER,
    allowNull: true,
    unique: true,
  },
  FirebaseID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,
  },
});

// Check the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports = {
  sequelize,
  User,
};
