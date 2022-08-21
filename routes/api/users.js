const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

router.get("/health", (req, res) => {
  res.json({ msg: "User api working" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });
    //check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = { id: user.id, name: user.name };

        jwt.sign(
          payload,
          process.env.SECRETKEY,
          { expiresIn: 60000 },
          (err, token) => {
            res.json({
              sucess: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res.status(400).json({ msg: "Password incorrect" });
      }
    });
  } catch (err) {
    return res.status(500).json("Server error");
  }
});

router.post("/register", async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exits" });
    }
    user = new User({
      userName,
      email,
      password,
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) throw err;
        user.password = hash;
        user
          .save()
          .then((user) => res.json(user))
          .catch((err) => console.log(err));
      });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      userName: req.user.userName,
      email: req.user.email,
      sentList: req.user.sentList,
      inboxList: req.user.inboxList,
      draftList: req.user.draftList,
      starred: req.user.starred,
      markedRead: req.user.markedRead,
    });
  }
);

router.get(
  "/userId/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      res.status(404).json({ msg: `user with id ${req.params.id} not found` });
      return;
    }
    res.status(200).json(user);
  }
);

router.get(
  "/email/:email",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      res
        .status(404)
        .json({ msg: `user with email ${req.params.email} not found` });
      return;
    }
    res.status(200).json(user);
  }
);

module.exports = router;
