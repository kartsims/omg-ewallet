const axios = require('axios');
const adminEndpoints = require('./endpoints-admin');

class EwalletError extends Error {
  constructor(apiResponse) {
    super(`${apiResponse.description} (${apiResponse.code})`)

    this.description = apiResponse.description
    this.code = apiResponse.code
    this.messages = apiResponse.messages

    Error.captureStackTrace(this, EwalletError)
  }
}

function Ewallet(baseURL) {

  this.api = axios.create({
    baseURL,
    headers: {
      'accept': 'application/vnd.omisego.v1+json',
      'Content-Type': 'application/vnd.omisego.v1+json',
      'Authorization': ""
    },
    responseType: 'json',
    transformResponse: [
      JSON.parse, 
      function ({ success, data }) {
        if (success === false) {
          throw new EwalletError(data)
        }
        return data;
      },
    ],
  });

  const prepareEndpoints = (endpoints) => {
    let sdk = {}
    Object.keys(endpoints).forEach(base => {
      sdk[base] = {};
      endpoints[base].forEach(action => {
        sdk[base][action] = (payload = {}) => {
          return this.api.post(`/admin/${base}.${action}`, payload).then(res => res.data)
        }
      })
    })
    return sdk
  }
  
  return {
    admin: prepareEndpoints(adminEndpoints),
  };
}

Ewallet.prototype.setAuthorization = function (authorization) {
  this.api.defaults.headers.Authorization = authorization;
};

module.exports = Ewallet;
