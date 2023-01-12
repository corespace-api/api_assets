const axios = require('axios');
const Logger = require('./logger');

const logger = new Logger("healthcheck/module/apiRequest");

const stringifyJson = (json) => {
  return JSON.stringify(json, null, 2);
}

class ApiRequest {
  constructor (url) {
    this.url = url
    this.body = {}
  }

  async get () {
    return axios.get(this.url)
      .then(response => {
        return response.data
      })
      .catch(error => {
        const errorMessage = {
          target: this.url,
          error: error
        }
        logger.error(stringifyJson(errorMessage))
      })
  }

  async post () {
    if (!this.body) {
      logger.error("No body provided for POST request")
      throw new Error('No body provided')
    }

    return axios.post(this.url, this.body)
      .then(response => {
        return response.data
      })
      .catch(error => {
        const errorMessage = {
          target: this.url,
          error: error
        }
        logger.error(stringifyJson(errorMessage))
      })
  }
}

module.exports = ApiRequest