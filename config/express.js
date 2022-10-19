const express = require("express");
const { create: handlebars } = require("express-handlebars");
const helpers = require("handlebars-helpers")
const session = require("express-session");
const userSession = require("../middleware/userSession");

module.exports = (app) => {
  app.engine(
    ".hbs",
    handlebars({
      extname: ".hbs",
    }).engine
  );
  app.set("view engine", ".hbs");
  helpers()
  app.use("/static", express.static("static"));
  app.use(
    session({
      secret: "mySecret",
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: "auto",
      },
    })
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(userSession());
};
