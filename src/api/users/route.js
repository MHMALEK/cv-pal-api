const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const { User, LinkedInData, CV, CustomizedCV } = require("../../database");
const { callGeminiApi } = require("../gemini/services");
const router = express.Router();
// router.use(authMiddleware.authenticateAdmin);

router.get("/", async (req, res) => {
  res.json("Hello, World!");
  F;
});

router.get("/me", async (req, res) => {
  res.json({ email: req.user.email, terms_accepted: req.user.terms_accepted });
});

router.put("/me", async (req, res) => {
  const { terms_accepted } = req.body;
  req.user.terms_accepted = terms_accepted;
  await req.user.save();
  res.json({ message: "User terms acceptance updated successfully" });
});

router.put("/me/linkedin", async (req, res) => {
  const { data } = req.body;

  let linkedInData = await LinkedInData.findOne({
    where: { userId: req.user.id },
  });

  if (!linkedInData) {
    linkedInData = await LinkedInData.create({
      data,
      userId: req.user.id,
    });
  } else {
    linkedInData.data = data;
    await linkedInData.save();
  }

  res.json({ message: "LinkedIn data updated successfully" });
});

router.post("/me/cv/generate", async (req, res) => {
  // Retrieve LinkedIn data for the current user
  const linkedInData = await LinkedInData.findOne({
    where: { userId: req.user.id },
  });
  if (!linkedInData) {
    return res.status(404).json({ message: "LinkedIn data not found" });
  }

  // Call Gemini API with LinkedIn data
  const cv = await callGeminiApi(req.user.id, linkedInData.data);

  const newCVInDB = await CV.create({
    userId,
    payload,
    text: cv,
  });

  // Return the generated CV
  res.json(cv);
});

router.post("/me/cv/regenerate", async (req, res) => {
  // Retrieve LinkedIn data for the current user
  const linkedInData = await LinkedInData.findOne({
    where: { userId: req.user.id },
  });
  if (!linkedInData) {
    return res.status(404).json({ message: "LinkedIn data not found" });
  }

  // Call Gemini API with LinkedIn data
  const newCv = await callGeminiApi(req.user.id, linkedInData.data);

  const newCVInDB = await CV.create({
    userId,
    payload,
    text: response.data,
  });

  // Return the newly generated CV
  res.json(newCv);
});
router.post("/me/cv/customize", async (req, res) => {
  const { sourceJobAdvertiseLink, payload } = req.body;
  const MAX_CV_COUNT = 10; // Set your maximum limit here

  try {
    // Fetch user data
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the most recent CustomizedCV for the user
    const lastCustomizedCv = await CustomizedCV.findOne({
      where: { userId: req.user.id },
      order: [["updatedAt", "DESC"]],
    });

    // Check if the user has reached the CV limit or if the day has changed
    const currentDay = new Date().getDate();
    const lastCvDay = lastCustomizedCv
      ? lastCustomizedCv.updatedAt.getDate()
      : null;
    const cvCountToday = lastCvDay === currentDay ? user.cvCount : 0;

    if (cvCountToday >= MAX_CV_COUNT) {
      return res.status(400).json({ message: "CV limit reached for today" });
    }

    // Check if user already has a CV saved
    const originalCv = await CV.findOne({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    if (!originalCv) {
      return res.status(404).json({ message: "No CV found for this user" });
    }

    // Combine the original CV data with the new payload
    const combinedPayload = {
      ...originalCv.data,
      ...payload,
    };

    // Call Gemini API with combined payload
    const result = await callGeminiApi(req.user.id, combinedPayload);

    // Save the result in the CustomizedCV table
    const newCustomizedCv = await CustomizedCV.create({
      userId: req.user.id,
      originalCvId: originalCv.id,
      sourceJobAdvertiseLink,
      result,
    });

    // Update user CV count
    user.cvCount = cvCountToday + 1;
    await user.save();

    // Return the newly generated CV
    res.json(newCustomizedCv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
});
// admin APIs
router.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.get("/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

router.put("/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const { email, terms_accepted } = req.body;
  user.email = email;
  user.terms_accepted = terms_accepted;
  await user.save();
  res.json({ message: "User updated successfully" });
});

router.delete("/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await user.destroy();
  res.json({ message: "User deleted successfully" });
});

module.exports = router;
