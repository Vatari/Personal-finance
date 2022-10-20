const router = require("express").Router();
const { isUser, isGuest } = require("../middleware/guards");
const { register, login } = require("../services/user");
const { mapErrors } = require("../util/mappers");

const NAME_PATTERN = /^[A-Za-z][A-Za-z0-9]*$/;

router.get("/register", isGuest(), (req, res) => {
  res.render("register", { title: "Register Page" });
});

router.post("/register", isGuest(), async (req, res) => {
  try {
    if (req.body.password.trim() == "") {
      throw new Error("Password is required");
    } else if (req.body.password !== req.body.repass) {
      throw new Error("Passwords do not match");
    }
    if (!NAME_PATTERN.test(req.body.username)) {
      throw new Error("Username must be only in english letters and digits!");
    }
    if (req.body.amount < 0) {
      throw new Error("Amount must be positive");
    }

    const user = await register(
      req.body.username,
      req.body.password,
      req.body.amount
    );
    req.session.user = user;
    res.redirect("/");
  } catch (err) {
    const errors = mapErrors(err);
    const data = {
      username: req.body.username,
      amount: req.body.amount,
    };
    res.render("register", {
      title: "Register Page",
      data,
      errors,
    });
  }
});

router.get("/login", isGuest(), (req, res) => {
  res.render("login", { title: "Login Page" });
});

router.post("/login", isGuest(), async (req, res) => {
  try {
    const user = await login(req.body.username, req.body.password);
    req.session.user = user;
    res.redirect("/");
  } catch (err) {
    const errors = mapErrors(err);

    res.render("login", {
      title: "Login Page",
      data: { username: req.body.username },
      errors,
    });
  }
});

router.get("/logout", isUser(), (req, res) => {
  delete req.session.user;
  res.redirect("/");
});

module.exports = router;
