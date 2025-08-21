const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastLogin: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
