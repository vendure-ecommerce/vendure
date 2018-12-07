import { INestApplication } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Connection } from 'typeorm';

import { logColored } from './cli-utils';

// tslint:disable:no-console
export async function populate() {
    logColored('\nPopulating... (this may take a minute or two)\n');
    const app = await getApplicationRef();
    if (app) {
        const { Populator } = require('vendure');
        const populator = app.get(Populator);
        const initialData = require('./assets/initial-data.json');
        await populator.populateInitialData(initialData);
        logColored('Done!');
        await app.close();
        process.exit(0);
    }
}

async function getApplicationRef(): Promise<INestApplication | undefined> {
    const tsConfigFile = path.join(process.cwd(), 'vendure-config.ts');
    const jsConfigFile = path.join(process.cwd(), 'vendure-config.js');
    let isTs = false;
    let configFile: string | undefined;
    if (fs.existsSync(tsConfigFile)) {
        configFile = tsConfigFile;
        isTs = true;
    } else if (fs.existsSync(jsConfigFile)) {
        configFile = jsConfigFile;
    }

    if (!configFile) {
        console.error(`Could not find a config file`);
        console.error(`Checked "${tsConfigFile}", "${jsConfigFile}"`);
        process.exit(1);
        return;
    }

    if (isTs) {
        // we expect ts-node to be available
        const tsNode = require('ts-node');
        if (!tsNode) {
            console.error(`For "populate" to work with TypeScript projects, you must have ts-node installed`);
            process.exit(1);
            return;
        }
        require('ts-node').register();
    }

    const index = require(configFile);

    if (!index) {
        console.error(`Could not read the contents of "${configFile}"`);
        process.exit(1);
        return;
    }
    if (!index.config) {
        console.error(`The file "${configFile}" does not export a "config" object`);
        process.exit(1);
        return;
    }

    const config = index.config;
    const { bootstrap } = require('vendure');
    console.log('Bootstrapping Vendure server...');
    const app = await bootstrap(config);
    return app;
}
