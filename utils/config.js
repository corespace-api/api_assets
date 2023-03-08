const fs = require('fs');

class ConfigManager {
  constructor(logger) {
    this.config = {}
    this.logger = logger

    this.logger.log("ConfigManager initialized");
  }

  loadConfig(path) {
    this.config = JSON.parse(fs.readFileSync(path, "utf-8"));
  }

  setData(data) {
    if (!data) { this.logger.error(`Error: the data parameter must be set`); return; }
    this.config = data;
  }

  getData() {
    return this.config;
  }

  setConfig(key, value) {
    if (!key) { this.logger.error(`Error: the key parameter must be set`); return;}
    if (!value) { this.logger.error(`Error: the value parameter must be set`); return; } 

    this.config[key] = value;
  }

  getConfig(key) {
    if (!key) { this.logger.error(`Error: the key parameter must be set`); return; }
    return this.config[key];
  }
}

module.exports = ConfigManager;