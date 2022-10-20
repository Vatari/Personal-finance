const { mapErrors } = require("../util/mappers");
const { isUser, isOwner, isGuest } = require("../middleware/guards");
const preload = require("../middleware/preload");

const {
  createItem,
  updateItem,
  deleteItem,
  refill,
  calcExpenses,
} = require("../services/item");

const router = require("express").Router();

router.get("/create", isUser(), (req, res) => {
  res.render("create", { title: "Create Page" });
});

router.post("/create", isUser(), async (req, res) => {
  const userId = req.session.user._id;

  const item = {
    merchant: req.body.merchant,
    total: req.body.total,
    category: req.body.category,
    description: req.body.description,
    report: req.body.report !== undefined ? true : false,
    owner: userId,
  };
  try {
    if (req.body.total < 0) {
      throw new Error("Total must be positive");
    }
    const result = await createItem(item);
    await calcExpenses(result, userId);

    res.redirect("/");
  } catch (err) {
    const errors = mapErrors(err);
    res.render("create", { title: "Create Page", errors, item });
  }
});

router.get("/edit/:id", preload(), isOwner(), isUser(), async (req, res) => {
  res.render("edit", { title: "Edit Page" });
});

router.post("/edit/:id", preload(), isOwner(), isUser(), async (req, res) => {
  const id = req.params.id;

  const item = {
    merchant: req.body.merchant,
    total: req.body.total,
    category: req.body.category,
    description: req.body.description,
    report: (req.body.report.value = "on" ? true : false),
  };

  try {
    await updateItem(id, item);
    res.redirect("/details/" + id);
  } catch (err) {
    const errors = mapErrors(err);
    item._id = id;
    res.render("edit", { title: "Edit Page", item, errors });
  }
});

router.get("/delete/:id", preload(), isOwner(), isUser(), async (req, res) => {
  const id = req.params.id;

  try {
    await deleteItem(id);
    res.redirect("/");
  } catch (err) {
    const errors = mapErrors(err);
    res.render("details", { title: existing.title, errors });
  }
});

router.post("/refill/", isUser(), async (req, res) => {
  const id = req.params.id;

  try {
    await refill(req.session.user._id, Number(req.body.refill));
    res.redirect("/");
  } catch (err) {
    const errors = mapErrors(err);
    res.render("details", { title: "Details", errors });
  }
});

module.exports = router;
