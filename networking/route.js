class Route {
  constructor(serviceName) {
    this.serviceName = serviceName;
    this.express = null;
    this.router = null;
    this.logger = null;
  }

  init() {
    const Logger = require("../utils/logger");
    this.logger = new Logger(`Web Service/${this.serviceName}`);

    this.logger.info("Initializing route");

    this.express = require("express");
    this.router = this.express.Router();
  }

  initLoggingMiddleware() {
    this.router.use((req, res, next) => {
      const headers = req.headers;
      const reqMessage = `Request: ${req.method} ${req.originalUrl} + ${JSON.stringify(headers)}`;
      this.logger.request(reqMessage);
      next();
    });
  }

  rootRoute() {
    this.router.get("/", (req, res) => {
      res.send("Hello World!");
    });
  }

  load() {
    this.init();
    this.initLoggingMiddleware();
    this.rootRoute();

    this.logger.success("initialized route");
  }
}

module.exports = Route;