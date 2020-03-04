const path = require('path');
const fs = require('fs');
// Copies the main package.json file into the lib directory so that
// ng-packagr can use it when generating the library bundle

console.log('Copying main package.json to library...');
const packageJson = require('../package');
fs.writeFileSync(path.join(__dirname, '/../src/lib/package.json'), JSON.stringify(packageJson, null, 2), 'utf8');
