const itemService = require("../services/item");

function preload(populate) {
  return async function (req, res, next) {
    const id = req.params.id;
    if (populate) {
      res.locals.item = await itemService.getItemAndUsers(id);
    } else {
      res.locals.item = await itemService.getItemById(id);
    }
    next();
  };
}

module.exports = preload;
