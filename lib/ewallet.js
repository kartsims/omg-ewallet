const adminEwallet = require('./ewallet.admin');

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

  const axiosOptions = {
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
  };
  
  return {
    admin: adminEwallet(axiosOptions),
  };
}

module.exports = Ewallet;
