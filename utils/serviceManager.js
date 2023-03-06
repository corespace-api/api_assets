const mongoose = require("mongoose");

const { DBConnector } = require("../database/DBManager");
const Logger = require("../utils/logger");

const serviceSchema = require("../models/service");

class ServiceManager {
  constructor(serviceInfo, timer, tenable) {
    this.serviceInfo = serviceInfo;
    this.dbc = new DBConnector();
    this.timer = timer || 10000;
    this.tenable = tenable || false;
    this.logger = new Logger(`Manager/ServiceManager`);
    this.logger.log("Loaded service manager successfully");
  }

  checkForServiceRemoval() {
    if (!this.tenable) return;
    this.logger.log("Checking for service removal...");
    setInterval(() => {
      serviceSchema.deleteMany({ status: "await_removal" }).then((result) => {
        this.logger.warn(`Removed ${result.deletedCount} service(s)`);
      }).catch((err) => {
        this.logger.error(err);
        return;
      });
    }, this.timer);
  }

  listenForKillSignal() {
    if (!this.tenable) return;
    this.logger.log("Listening to kill signal ( 10 seconds ) ...");
    setInterval(() => {
      serviceSchema.findOne({ uuid: this.serviceInfo.uuid }).then((result) => {
        if (!result) {
          this.logger.warn("Service not found");
          this.logger.warn("Killing service...");
          process.exit(1);
        }

        if (result.status === "await_kill") {
          this.logger.warn("Service status set to 'await_kill'");
          this.logger.warn("Killing service...");
          this.unregisterService()
            .then(() => {
              this.logger.success("Service unregistered");
              // set the service status to 'await_removal'
              this.setServiceStatus("await_removal")
              process.exit(1);
            }).catch((err) => {
              this.logger.error("Service unregistration failed: ", err);
              process.exit(1);
            });
        }
      }).catch((err) => {
        this.logger.error(err);
        return;
      });
    }, this.timer);
  }

  setServiceStatus(status) {
    // find the service and update the status and lastSeen
    return new Promise((resolve, reject) => {
      serviceSchema.updateOne(
        { uuid: this.serviceInfo.uuid }, 
        { $set: { status: status, lastSeen: new Date() } }).then((result) => {
          resolve(result);
        }).catch((err) => {
          this.logger.error(err);
          return reject(err);
        });
    });
  }

  unregisterService() {
    return new Promise((resolve, reject) => {
      this.logger.log("Starting service unregistration...");

      serviceSchema.updateOne(
        { uuid: this.serviceInfo.uuid },
        { $set: { status: "await_removal" } },
      ).then((result) => {
        this.logger.success("Service status updated to 'await_removal'");
        resolve(result);
      }).catch((err) => {
        this.logger.error(err);
        return reject(err);
      });
    });
  }

  registerService() {
    this.logger.log("Starting service registration...");
    // this.dbc.createAUrl();
    // this.dbc.attemptConnection();

    const newService = new serviceSchema({
      _id: new mongoose.Types.ObjectId(),
      uuid: this.serviceInfo.uuid,
      name: this.serviceInfo.name,
      description: this.serviceInfo.description,
      version: this.serviceInfo.version,
    });

    this.logger.log("Attemping to register service...");

    newService
      .save()
      .then((result) => {
        this.logger.success("Service registered successfully");
        this.logger.info(`Service registered with: ${result.uuid}`);
      })
      .catch((err) => {
        this.logger.error(err);
      });
  }
}

module.exports = ServiceManager;
