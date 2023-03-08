class Route {
  constructor(name) {
    this.name = name;
    this.express = null;
    this.router = null;
    this.logger = null;
  }

  init(logger, express) {
    this.logger = logger;
    this.express = express;
    this.router = this.express.Router();
  }

  rootRoute() {
    this.router.get("/", (req, res) => {
      res.send("Hello World!");
    });
  }

  load() {
    this.init();
    this.rootRoute();
  }
}

module.exports = Route;