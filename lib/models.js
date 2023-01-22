const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  events: {
    type: Array,
    default: [],
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
