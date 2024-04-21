const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();
router.use(authMiddleware.authenticateAdmin);

router.post("/signup", async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.json(newUser);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res
        .status(409)
        .json({ message: "User already signed up with these details." });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const user = await userService.getUser(req.params.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    await userService.deleteUser(req.params.userId);
    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:userId", async (req, res) => {
  try {
    await userService.updateUser(req.params.userId, req.body);
    res.json({ message: "User updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
