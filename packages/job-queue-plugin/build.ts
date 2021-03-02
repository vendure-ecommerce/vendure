/* tslint:disable:no-console */
import fs from 'fs-extra';
import path from 'path';

fs.copyFileSync(
    path.join(__dirname, './src/pub-sub/package.json'),
    path.join(__dirname, './lib/pub-sub/package.json'),
);
