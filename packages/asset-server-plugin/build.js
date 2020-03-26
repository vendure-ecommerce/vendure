const fs = require('fs');
const path = require('path');

fs.copyFileSync(path.join(__dirname, 'src/file-icon.png'), path.join(__dirname, 'lib/src/file-icon.png'));
