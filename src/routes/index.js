const router = require("express").Router();

const docsRouter = require("./docs.router");

const ApiRouter = (app) => {
  app.use("/", router);
  router.use("/docs", docsRouter);
};

module.exports = ApiRouter;
