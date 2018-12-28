# How to use

**Tested in NodeJS only !**

```javascript
const ewallet = require('omg-ewallet')('http://localhost:4000/api')

// admin usage
ewallet.admin.login('__EMAIL__', '__PASSWORD__').then(res => {
  console.log('[%s] logged in !', res.user.email)
  return ewallet.admin.admin.all({
    per_page: 3
  })
}).then(data => {
  console.log('admin.all', data)
}).catch(err => {
  console.log('ERROR', err)
})

// client usage
ewallet.client.login('__EMAIL__', '__PASSWORD__').then(res => {
  console.log('[%s] logged in !', res.user.email)
  return ewallet.client.me.get_wallets({
    per_page: 3
  })
}).then(data => {
  console.log('me.get_wallets', data)
}).catch(err => {
  console.log('ERROR', err)
})
```

# Update endpoints

Copy `apps/ewallet_api/priv/spec.json` from the [ewallet repo](https://github.com/omisego/ewallet) to get the latest specs into `api-specs/client.json`. 

Also copy `apps/admin_api/priv/spec.json` to `api-specs/admin.json`. 

Then run 

```
node api-specs/extract.js
```

# TODO

- Usability in a browser environment
- Compatibility with Node 8+
- JS Linting
- TypeScript definitions
- Helper class to handle paginated results
