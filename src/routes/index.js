const router = require("express").Router();

const userRoute = require("./user.route");
const errorHandle = require("../middlewares/errorHandle");

const initRoute = (app) => {
  router.use("/users", userRoute);

  //handle error
  router.use("*", errorHandle);
  return app.use("/api", router);
};

module.exports = initRoute;
