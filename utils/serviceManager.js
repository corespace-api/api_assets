class ServiceManager {
  constructor(name) {
    this.name = name;

    // Dependencies
    this.dbc = null;
    this.logger = null;
    this.fs = null;
    this.path = null;
    this.express = null;
    this.server = null;
    this.crypto = null;
    this.mongoose = null;
    this.getAllRoutes = null;
    this.commandHandler = null;

    // Configuration
    this.config = null;
    this.serviceSchema = require("../models/service");
    this.missedHeartbeats = 0;
    this.uuid = null
  }

  createLogger() {
    this.uuid = this.crypto.randomBytes(16).toString("hex");
    const Logger = require('./logger');
    this.logger = new Logger(this.name, this.uuid);
    this.logger.info('Initializing service...');
    this.logger.warn(`${this.uuid} assigned to service`)
  }

  loadDependencies() {
    this.fs = require('fs');
    this.path = require('path');
    this.crypto = require("crypto");
    this.mongoose = require("mongoose");
  }

  loadCustomDependencies() {
    this.logger.log("Loading custom dependencies...");

    const DBConnector = require("../database/DBManager");
    this.dbc = new DBConnector(); this.logger.info("DBManager loaded");

    const ConfigManager = require("./config");
    this.config = new ConfigManager(this.logger); this.logger.info("ConfigManager loaded");

    this.getAllRoutes = require("./getAllRoutes");

    const CommandHandler = require("../commands/Handler")
    this.commandHandler = new CommandHandler(this.config, this.logger, this.dbc, this.serviceSchema)
  }

  loadConfig() {
    this.logger.log("Loading configuration...");
    this.config.loadConfig("config.json");
    this.config.setConfig("command_path", "../commands")
    this.logger.success("Configuration loaded");
  }

  dbConnection() {
    // Starting connection to the database
    this.dbc.setConfig(this.config.getConfig("mongodb"));
    this.dbc.createAUrl();
    this.logger.log(`Starting connection to the database...`);
    this.logger.log(`Database URL: ${this.dbc.url}`);
    this.dbc.attemptConnection()
      .then(() => {
        this.logger.success("Database connection succeeded");
      })
      .catch((error) => {
        this.logger.warn("Database connection failed, retrying in 5 seconds...");
        this.logger.error(error);
        setTimeout(() => {
          this.logger.log("Retrying database connection...");
          this.dbConnection();
        }, 5000);
      });
  }

  setStatus(status) {
    this.serviceSchema.findOne({ uuid: this.config.getConfig("uuid") }).then((service) => {
      if (!service) {
        this.logger.warn("Service not found in database");
        process.exit(1);
      }
      if (!service) { this.logger.warn("Service not found in database"); process.exit(1); }

      service.status = status;
      service.save().then(() => {
        this.logger.success(`Service status updated to '${status}'`);
      }).catch((error) => {
        this.logger.error(error);
      });
    }).catch((error) => {
      this.logger.error(error);
    });
  }

  crashHandling(error) {
    this.logger.error(error)
    this.setStatus(`Crashed: ${error}`)
    process.exit(1);
  }

  registerService() {
    this.logger.log("Registering service...");
    this.config.setConfig("uuid", this.uuid)

    const serviceModel = new this.serviceSchema({
      _id: new this.mongoose.Types.ObjectId(),
      uuid: this.config.getConfig("uuid"),
      name: this.config.getConfig("name"),
      description: this.config.getConfig("description"),
      version: this.config.getConfig("version")
    });

    serviceModel.save().then(() => {
      this.logger.success("Service registered");
    }).catch((error) => {
      this.logger.error(error);
    });
  }

  listenCommands() {
    this.commandHandler.init();
  }

  heardBeat() {
    setInterval(() => {
      if (this.missedHeartbeats >= 3) {
        this.logger.error("Missed 3 heartbeats, shutting down service");
        process.exit(1);
        this.crashHandling("Missed 3 heartbeats, shutting down service")
      }

      // Sending heartbeat in form of updating the lastSeen field
      this.logger.log("Sending heartbeat signal...");
      this.serviceSchema.findOne({ uuid: this.config.getConfig("uuid") }).then((service) => {
        if (!service) {
          this.logger.warn(`Missed heartbeat, possible connection issue`)
          this.missedHeartbeats++;
          return;
        }

        service.lastSeen = new Date().toISOString();
        service.save();
      });
    }, this.config.getConfig("heartbeat") || 5000);
  }
}

module.exports = ServiceManager;