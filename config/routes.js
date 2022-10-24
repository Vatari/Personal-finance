const homeController = require("../controllers/home");
const authController = require("../controllers/auth");
const itemController = require("../controllers/itemController");

module.exports = (app) => {
  app.use(homeController);
  app.use(authController);
  app.use(itemController);

  app.get("*", (req, res) => {
    res.render("404", { title: "404 Page Not Found!" });
  });
};
