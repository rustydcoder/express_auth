const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("../routes/userRouter");

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

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const tokenIsValid = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, deleteUser, tokenIsValid };
