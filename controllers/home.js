const { isUser } = require("../middleware/guards");
const { getItems, getUserAndItems } = require("../services/item");
const preload = require("../middleware/preload");

const router = require("express").Router();

router.get("/", async (req, res) => {
  let userId;
  if (req.session.user) {
    userId = req.session.user._id;
  }
  let items = await getItems(userId);

  res.render("home", { title: "Home Page", items });
});

router.get("/details", async (req, res) => {
  const items = await getItems();
  res.render("details", { title: "Details Page", items });
});

router.get("/details/:id", preload(true), isUser(), async (req, res) => {
  if (req.session.user) {
    res.locals.item.hasUser = true;
    res.locals.item.isOwner =
      req.session.user?._id == res.locals.item.owner._id;
  }
  if (res.locals.item.isOwner) {
    res.render("details", { title: "Details" });
  } else {
    res.render("404");
  }
});

router.get("/profile", preload(true), isUser(), async (req, res) => {
  const user = await getUserAndItems(req.session.user._id);

  let total = user.expenses.reduce((acc, x) => acc + x, 0);

  res.render("profile", { title: "My Profile", user, total });
});

module.exports = router;
