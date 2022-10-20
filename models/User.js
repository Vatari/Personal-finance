const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;
const NAME_PATTERN = /^[A-Za-z][A-Za-z0-9]*$/;
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  password: {
    type: String,
    required: true,
    minLength: [5, "Password must be at least 5 characters"],
  },
  amount: { type: Number, required: true, default: 0 },
  expenses: { type: [Number], ref: "Item", default: [] },
});

userSchema.index(
  { username: 1 },
  {
    unique: true,
    collation: {
      locale: "en",
      strength: 2,
    },
  }
);

userSchema.pre("save", function (next) {
  if (this.expenses.length > 0) {
    return next();
  } else {
    return bcrypt.hash(this.password, SALT_ROUNDS).then((hash) => {
      this.password = hash;
      return next();
    });
  }
});

userSchema.method("validatePassword", function (password) {
  return bcrypt.compare(password, this.password);
});

const User = model("User", userSchema);

module.exports = User;
