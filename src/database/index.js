const Sequelize = require("sequelize");

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db/app.db",
});

const User = sequelize.define("User", {
  id: {
    type: Sequelize.NUMBER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  Name: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  },
  terms_accepted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  cvCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});
const LinkedInData = sequelize.define("LinkedInData", {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  data: Sequelize.JSON,
});
LinkedInData.belongsTo(User);

User.hasOne(LinkedInData);

const CV = sequelize.define("CV", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  payload: Sequelize.TEXT,
  text: Sequelize.TEXT,
});
CV.belongsTo(User);
User.hasMany(CV);

const CustomizedCV = sequelize.define("CustomizedCV", {
  originalCvId: Sequelize.INTEGER,
  sourceWebsite: Sequelize.STRING,
  sourceJobAdvertiseLink: Sequelize.STRING,
  result: Sequelize.TEXT,
});

CustomizedCV.belongsTo(User);
User.hasMany(CustomizedCV);

CustomizedCV.belongsTo(CV, {
  as: "originalCv",
  foreignKey: "originalCvId",
});
CV.hasMany(CustomizedCV);

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
  CV,
  LinkedInData,
  User,
  CustomizedCV,
};
