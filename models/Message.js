const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
  },
  message: {
    type: String,
  },
  drafted: {
    type: Boolean,
  },
  sendStarred: {
    type: Boolean,
  },
  inboxStarred: {
    type: Boolean,
  },
  markedRead: {
    type: Boolean,
  },
});

module.exports = mongoose.model("message", MessageSchema);
