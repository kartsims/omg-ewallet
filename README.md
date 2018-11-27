# How to use

**Tested in NodeJS only !**

```javascript
const ewallet = require('omg-ewallet')('http://localhost:4000/api')

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
```

# TODO

- Usability in a browser environment
- Compatibility with Node 8+
- JS Linting
- TypeScript definitions
- Helper class to handle paginated results
