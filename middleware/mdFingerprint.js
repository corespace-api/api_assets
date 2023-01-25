const Fingerprint = require('../networking/fingerprint');

function fingerprintMiddleware(req, res, next) {
  const fingerprintData = {
    userAgent: req.headers['user-agent'],
    host: req.headers['host'],
    keepAlive: req.headers['keep-alive'],
    accept: req.headers['accept'],
    secgpc: req.headers['sec-gpc'],
    acceptencoding: req.headers['accept-encoding'],
    acceptlanguage: req.headers['accept-language'],
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
  }

  const fpg = new Fingerprint(fingerprintData);
  const hash = fpg.generate();

  req.fingerprint = hash;
  next();
}

module.exports = fingerprintMiddleware;