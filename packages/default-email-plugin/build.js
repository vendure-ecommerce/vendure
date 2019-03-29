/* tslint:disable:no-console */
const fs = require('fs-extra');

fs.copy('./templates', './lib/templates')
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
