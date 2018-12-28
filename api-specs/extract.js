const fs = require('fs');
const path = require('path');

const specs = {
  admin: require('./admin.json'),
  client: require('./client.json'),
};

function extractPaths(api) {
  const paths = Object.keys(specs[api].paths)
  let endpoints = {}
  console.log('Extracting %d paths from %s specs', paths.length, api)
  paths.forEach(path => {
    let segments = path.replace(/^\//, '').split('.')
    if (endpoints[segments[0]] === undefined) {
      endpoints[segments[0]] = []
    }
    endpoints[segments[0]].push(segments[1])
  })

  fs.writeFileSync(path.join(__dirname, '..', 'endpoints', api + '.json'), JSON.stringify(endpoints, null, 2))
}

extractPaths('admin')
extractPaths('client')

console.log('DONE')
