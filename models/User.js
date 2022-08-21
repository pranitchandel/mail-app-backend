const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  sentList: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  inboxList: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  draftList: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  starred: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  markedRead: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});

module.exports = mongoose.model("user", UserSchema);
