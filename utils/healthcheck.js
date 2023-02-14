class Healthcheck {
  constructor(service) {
    this.service = service | "unknown";
    this.healthy = true;
    this.uptime = process.uptime();
  }

  getHealth() {
    return {
      service: this.service,
      healthy: this.healthy,
      uptime: this.uptime
    };
  }

  setHealthy(healthy) {
    this.healthy = healthy;
  }

  getUptime() {
    return this.uptime;
  }

  setUptime(uptime) {
    this.uptime = uptime;
  }

  getService() {
    return this.service;
  }

  setService(service) {
    this.service = service;
  }

  checkDBConnection() {
    // TODO: Check DB connection
  }
}