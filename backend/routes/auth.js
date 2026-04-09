const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require ("../middleware/auth");

router.post("/signup", async (req, res) => {
  try {
    console.log("STEP 1: Body", req.body);

    const { name, email, profileBio, password } = req.body;
    const existing = await User.findOne({ email });

    if (existing) {
      console.log("User already exists");
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      profileBio,
      password: hashed,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(400).json({ error: "User not found" });
  const valid = await bcrypt.compare(password, user.password);
  if(!valid) return res.status(400).json({ error: "Invalid password" });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ userId: user._id, token });
});

// Update User Profile
router.put("/v1/updateProfile", auth, async (req, res) => {
  //const {name, profileBio} = req.body;
  const user = await User.findByIdAndUpdate(req.user.userId, {$set: req.body}, { returnDocument: 'after' });
  if (!user) return res.status(400).json({error: "User not found"});
  res.json({status: 200, user});
});

// Get User ID
router.post("/getId", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(400).json({ error: "User not found" });
  res.json({ status: "200", userId: user._id });
});

module.exports = router;