const axios = require('axios');

const endpoints = {
  admin: require('../endpoints/admin.json'),
  client: require('../endpoints/client.json'),
}

class EwalletError extends Error {
  constructor(apiResponse) {
    super(`${apiResponse.description} (${apiResponse.code})`)

    this.description = apiResponse.description
    this.code = apiResponse.code
    this.messages = apiResponse.messages

    Error.captureStackTrace(this, EwalletError)
  }
}

function Ewallet(name, opts) {

  // allow for single string argument (baseURL)
  if (typeof opts === 'string') {
    opts = {
      baseURL: opts
    }
  }
  if (!opts.baseURL) {
    throw new Error('baseURL must be set')
  }

  // prepare axios instance
  const axiosOptions = {
    baseURL: opts.baseURL + '/' + name,
    headers: {
      'accept': 'application/vnd.omisego.v1+json',
      'Content-Type': 'application/vnd.omisego.v1+json',
      'Authorization': ''
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
  };
  if (name === 'client') {
    if (!opts.apiKey) {
      throw new Error('apiKey must be set')
    }
    axiosOptions.headers.Authorization = 'OMGClient ' + Buffer.from(opts.apiKey + ':').toString('base64')
  }
  this.api = axios.create(axiosOptions);

  let sdk = {}

  // login method
  if (name === 'admin') {
    sdk.login = (email, password) => this.api.post('/admin.login', {
      email, password
    }).then(({ data }) => {
      this.api.defaults.headers.Authorization = 'OMGAdmin ' + Buffer.from(data.user_id + ':' + data.authentication_token).toString('base64')
      return data
    })
  } else if (name === 'client') {
    if (!opts.apiKey) {
      throw new Error('apiKey must be set')
    }
    sdk.login = (email, password) => this.api.post('/user.login', {
      email, password
    }).then(({ data }) => {
      this.api.defaults.headers.Authorization = 'OMGClient ' + Buffer.from(opts.apiKey + ':' + data.authentication_token).toString('base64')
      return data
    })
  }

  // prepare endpoints
  Object.keys(endpoints[name]).forEach(base => {
    sdk[base] = {};
    endpoints[name][base].forEach(action => {
      sdk[base][action] = (payload = {}) => {
        return this.api.post(`/${base}.${action}`, payload).then(res => res.data)
      }
    })
  })

  return sdk;
}

module.exports.admin = (opts) => Ewallet('admin', opts);
module.exports.client = (opts) => Ewallet('client', opts);
