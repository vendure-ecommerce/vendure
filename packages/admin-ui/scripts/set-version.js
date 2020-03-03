const path = require('path');
const fs = require('fs');
const appVersion = require('../package.json').version;

const versionFilePath = path.join(__dirname + '/../src/environments/version.ts');

const src = `export const ADMIN_UI_VERSION = '${appVersion}';
`;

// ensure version module pulls value from package.json
fs.writeFile(versionFilePath, src, { flat: 'w' }, function(err) {
    if (err) {
        return console.log(err);
    }

    console.log(`Updating application version ${appVersion}`);
});
