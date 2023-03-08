const crypto = require('crypto');

class Fingerprint {
  constructor(fingerprintData) {
    this.userAgent = fingerprintData.userAgent;
    this.host = fingerprintData.host;
    this.keepAlive = fingerprintData.keepAlive;
    this.accept = fingerprintData.accept;
    this.secgpc = fingerprintData.secgpc;
    this.acceptencoding = fingerprintData.acceptencoding;
    this.acceptlanguage = fingerprintData.acceptlanguage;
    this.ip = fingerprintData.ip;
  }

  generate() {
    const fingerprintData = {
      userAgent: this.userAgent,
      host: this.host,
      keepAlive: this.keepAlive,
      accept: this.accept,
      secgpc: this.secgpc,
      acceptencoding: this.acceptencoding,
      acceptlanguage: this.acceptlanguage,
      ip: this.ip
    }

    // create a 512 bit hash of the fingerprint data
    const hash = crypto.createHash('sha512').update(JSON.stringify(fingerprintData)).digest('hex');
    return hash;
  }
}

module.exports = Fingerprint;