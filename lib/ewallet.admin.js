const axios = require('axios');

// TBD : finish adding all endpoints
const endpoints = {
  admin: [
    'login',
    'all',
    'get',
    'enable_or_disable',
    'reset_password',
    'update_password',
    'verify_email_update',
  ],
  me: [
    'logout',
    'get',
    'update',
    'update_email',
    'update_password',
    'upload_avatar',
    'get_account',
    'get_accounts',
  ],
  user: [
    'login',
    'logout',
    'all',
    'create',
    'update',
    'get',
    'get_wallets',
    'get_transactions',
    'enable_or_disable',
    'get_transaction_consumptions',
  ],
  role: [
    'all',
    'get',
    'create',
    'update',
    'delete',
    '',
  ],
  invite: [
    'accept',
  ],
  auth_token: [
    'switch_account',
  ],
};

module.exports = function(axiosOptions) {
  this.api = axios.create(axiosOptions)
  let sdk = {}

  // login method
  sdk.login = (email, password) => this.api.post('/admin/admin.login', {
    email, password
  }).then(({ data }) => {
    console.log('AUTH data', data)
    this.api.defaults.headers.Authorization = 'OMGAdmin ' + Buffer.from(data.user_id + ':' + data.authentication_token).toString('base64')
    return data
  })

  // prepare endpoints
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
