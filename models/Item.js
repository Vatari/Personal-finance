const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const URL_PATTERN =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

const ItemSchema = new Schema(
  {
    merchant: {
      type: String,
      required: true,
      minLength: [4, "Merchant must be at least 4 characters"],
    },
    total: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minLength: [10, "Description must be at least 20 characters"],
      maxLength: [50, "Description must be at most 50 characters"],
    },
    report: {
      type: Boolean,
      required: true,
    },

    owner: { type: ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { type: Date, default: Date.now }, //inserts creation date
  }
);

const Item = model("Item", ItemSchema);

module.exports = Item;
