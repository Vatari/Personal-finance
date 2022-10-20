const Item = require("../models/Item");
const User = require("../models/User");

async function createItem(item) {
  const result = new Item(item);

  await result.save();
  return result;
}

async function calcExpenses(item, userId) {
  const user = await User.findById(userId);
  user.expenses.push(item.total);
  user.amount -= item.total;
  await user.save();
}

async function getItems() {
  return Item.find({}).sort({ createdAt: -1 }).limit(3).lean();
}

async function getItemsByAuthor(userId) {
  return Item.find({ author: userId }).lean();
}

async function getItemById(id) {
  return Item.findById(id).lean();
}

async function updateItem(id, item) {
  const existing = await Item.findById(id);

  existing.title = item.title;
  existing.description = item.description;
  existing.imageUrl = item.imageUrl;
  existing.duration = item.duration;

  await existing.save();
}

async function deleteItem(id) {
  return Item.findByIdAndDelete(id);
}

async function refill(userId, value) {
  const user = await User.findById(userId);
  user.amount += Number(value);

  await user.save();
}

async function getItemAndUsers(id) {
  return Item.findById(id).populate("owner").lean();
}

async function getUserAndItems(userId) {
  return User.findById(userId).lean();
}

async function searchItem(text) {
  return Item.find({ title: { $regex: text, $options: "i" } }).lean();
}

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  refill,
  getItemsByAuthor,
  getUserAndItems,
  searchItem,
  getItemAndUsers,
  calcExpenses,
};
