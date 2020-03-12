const path = require('path');
const fs = require('fs');
// Copies the main package.json file into the lib directory so that
// ng-packagr can use it when generating the library bundle
console.log('Copying main package.json to library...');
const packageJson = require('../package.json');
const { name, version, license, dependencies } = packageJson;
const subset = { name, version, license, dependencies };

fs.writeFileSync(path.join(__dirname, '/../src/lib/package.json'), JSON.stringify(subset, null, 2), 'utf8');
