require("dotenv").config();

exports.authenticateAdmin = (req, res, next) => {
  const apiKey = req.header("API-KEY");
  if (!apiKey || apiKey !== process.env.API_KEY) {
    res.status(403).json({ message: "Forbidden" });
  } else {
    next();
  }
};
