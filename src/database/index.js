const Sequelize = require("sequelize");

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db/app.db",
});

const User = sequelize.define(
  "User",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    terms_accepted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    cvCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

const LinkedInData = sequelize.define(
  "linkedInData",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    data: {
      type: Sequelize.JSON,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

LinkedInData.belongsTo(User);

User.hasOne(LinkedInData);

const CV = sequelize.define("CV", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
