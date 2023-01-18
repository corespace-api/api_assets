const dotenv = require('dotenv');
dotenv.config();

var corsOptions = {
  origin: process.env.ALLOWED_ORIGINS || `http://localhost:${process.env.PORT}`,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  methods: process.env.ALLOWED_METHODS_X || 'POST, GET, OPTIONS, DELETE, PUT',
  allowedHeaders: process.env.ALLOWED_HEADERS || 'Content-Type, x-requested-with, x-access-token, x-refresh-token, _id',
  maxAge: process.env.ALLOWED_MAX_AGE || 86400,
}

module.exports = corsOptions;