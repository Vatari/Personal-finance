const express = require("express");
const expressConfig = require("./config/express");
const databaseConfig = require("./config/dbConfig");
const routesConfig = require("./config/routes");

start();

async function start() {
  const app = express();
  expressConfig(app);
  await databaseConfig(app);
  routesConfig(app);

  app.listen(3030, () =>
    console.log("Server succsessfully started at port 3030")
  );
}
