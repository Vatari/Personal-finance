const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    minLength: [4, "Username must be at least 4 characters"],
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password must be at least 8 characters"],
  },
  amount: { type: Number, default: 0 },
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
