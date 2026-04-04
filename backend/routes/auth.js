const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    console.log("STEP 1: Body", req.body);

    const { name, email, password } = req.body;

    console.log("STEP 2: Before DB check");
    const existing = await User.findOne({ email });

    console.log("STEP 3: After DB check");
    if (existing) {
      console.log("User already exists");
      return res.status(400).json({ error: "Email already exists" });
    }

    console.log("STEP 4: Before hashing");
    const hashed = await bcrypt.hash(password, 10);

    console.log("STEP 5: After hashing");

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    console.log("STEP 6: User created");

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("STEP 7: Token created");

    res.json({ token });

  } catch (err) {
    console.error("🔥 ERROR:", err);
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
  res.json({ token });
});

module.exports = router;