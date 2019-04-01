/* tslint:disable:no-console */
const path = require ('path');
const fs = require ('fs-extra');
const { exec } = require('child_process');

console.log('Building admin-ui from source...');
exec(
    'yarn build --prod=true',
    {
        cwd: path.join(__dirname, '../../admin-ui'),
    },
    async error => {
        if (error) {
            console.log(error);
            process.exit(1);
        }
        console.log('done!');
        await fs.copy('../../admin-ui/dist/vendure-admin', 'lib/admin-ui');
        process.exit(0);
    },
);
