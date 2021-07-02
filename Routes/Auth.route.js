const express = require("express");
const router = express.Router();
const User = require("../Models/User.model");
const { authSchema } = require("../helpers/validationSchema");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt_helper");

router.post("/register", async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const doesExit = await User.findOne({ email: result.email });
    // if (doesExit) {
    //   return;
    // }
    const user = new User({ email: result.email, password: result.password });
    const savedUser = await user.save();
    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signRefreshToken(savedUser.id);
    res.status(201).send({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
});
router.post("/login", async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });
    const isMatch = await user.isValidPassword(result.password);
    if (!isMatch) {
      console.log("Wrong password");
    }
    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    console.log(accessToken);
    res.status(200).send({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
});
router.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) console.log("Reftoken undefined");
    const userId = await verifyRefreshToken(refreshToken);
    const newAccToken = await signAccessToken(userId);
    const newRefToken = await signRefreshToken(userId);
    res.send({ accessToken: newAccToken, refreshToken: newRefToken });
  } catch (error) {
    next(error);
  }
});
router.delete("/logout", async (req, res) => {
  res.send("logout router");
});

module.exports = router;
