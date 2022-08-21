const express = require("express");
const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config();
const Message = require("../../models/Message");
const User = require("../../models/User");
const router = express.Router();

router.post(
  "/addMessage",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const message = new Message({
      title: req.body.title,
      message: req.body.message,
      fromUserId: req.user._id,
      toUserId: req.body.toUserId,
      drafted: false,
      sendStarred: false,
      inboxStarred: false,
      markedRead: false,
    });
    const toUser = await User.findOne({ _id: req.body.toUserId });
    if (!toUser) {
      res.status(404).json({ msg: `User ${req.body.toUserId} not found` });
      return;
    }
    message
      .save()
      .then((msg) => {
        toUser.inboxList.push(msg._id);
        toUser
          .save()
          .then((user) => console.log(`inbox list updated for ${user}`))
          .catch((err) => console.log("Error while updating inbox list" + err));
        console.log("Sent11111111111111111111", req.user);
        req.user.sentList.push(msg._id);
        req.user
          .save()
          .then((user) => console.log(`sent list updated for ${user}`))
          .catch((err) => console.log("Error while updating sent list" + err));
        res.status(200).json(message);
      })
      .catch((err) => console.log("Error in inserting message " + err));
  }
);

router.put(
  "/:id/:updateCategory",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const message = await Message.findOne({ _id: req.params.id });
    if (!message) {
      res.status(404).json({ msg: "Message not found" });
      return;
    } else if (req.params.updateCategory === "marked") {
      message.markedRead = !message.markedRead;
      message
        .save()
        .then((msg) => res.status(200).json(msg))
        .catch((err) => console.log("Message not found " + err));
    } else if (req.params.updateCategory === "drafted") {
      message.drafted = !message.drafted;
      message
        .save()
        .then((msg) => res.status(200).json(msg))
        .catch((err) => console.log("Message not found " + err));
    } else if (req.params.updateCategory === "sendStarred") {
      console.log("In sendstarred " + message);
      message.sendStarred = !message.sendStarred;
      message
        .save()
        .then((msg) => res.status(200).json(msg))
        .catch((err) => console.log("Message not found " + err));
    } else if (req.params.updateCategory === "inboxStarred") {
      message.inboxStarred = !message.inboxStarred;
      message
        .save()
        .then((msg) => res.status(200).json(msg))
        .catch((err) => console.log("Message not found " + err));
    } else {
      res.status(404).json({ msg: "Unknown update category" });
    }
  }
);

router.post(
  "/addDraft",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const message = new Message({
      title: req.body.title,
      message: req.body.message,
      fromUserId: req.user._id,
      toUserId: req.body.toUserId,
      drafted: true,
      sendStarred: false,
      inboxStarred: false,
      markedRead: false,
    });
    message
      .save()
      .then((msg) => {
        req.user.draftList.push(msg);
        req.user
          .save()
          .then((user) =>
            console.log(
              `draft message ${msg._id} added successsfully to user ${user._id}`
            )
          )
          .catch((err) =>
            console.log(`Error while drafting message for ${user} ` + err)
          );
        res.status(200).json(msg);
      })
      .catch((err) => console.log("Error while creating draft message " + err));
  }
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const message = await Message.findOne({ _id: req.params.id });
    if (!message) {
      res.status(404).json({ msg: "Message not found" });
      return;
    }
    res.status(200).json(message);
  }
);

router.delete(
  "/deleteMessage/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const deletedMessageAcknowledge = await Message.deleteOne({
      _id: req.params.id,
    });
    if (deletedMessageAcknowledge.deletedCount === 0) {
      res.status(404).json({ msg: "Message not found" });
      return;
    }
    res.status(200).json({ msg: "message deleted successfully" });
  }
);

module.exports = router;
