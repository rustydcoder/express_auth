const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName } = req.body;
    const existingUser = await User.findOne({ email });

    // validate req.body
    if (!email || !password || !passwordCheck)
      return res
        .status(400)
        .json({ message: "Not all fields have been entered" });

    if (password.length < 5)
      return res
        .status(400)
        .json({ message: "password needs to be at least 5 characters long" });
    if (password !== passwordCheck)
      return res.status(400).json({
        message: "Password does not match",
      });
    if (existingUser)
      return res.status(400).json({
        message: "User already exists with this email",
      });
    if (!displayName) displayName = email;

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hash,
      displayName,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // validate
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Not all fields have been entered" });

    if (!user)
      return res.status(400).json({ message: "No account with this email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
