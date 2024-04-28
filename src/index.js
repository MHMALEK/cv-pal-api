require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./database");
const { authenticate } = require("./firebase");

const app = express();

app.use(bodyParser.json());
app.use(authenticate);

// routes
// create and get vpn configs
app.use("/users", require("./api/users/route"));

app.listen(3000, async () => {
  await sequelize
    .sync()
    .then(() => {
      console.log("Tables have been created");
    })
    .catch((error) => {
      console.error("An error occurred while creating the tables", error);
    });
});
