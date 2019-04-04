/* tslint:disable:no-console */
import chalk from 'chalk';
import program from 'commander';
import fs from 'fs-extra';
import Listr from 'listr';
import os from 'os';
import path from 'path';

import { gatherUserResponses } from './gather-user-responses';
import { checkNodeVersion, checkThatNpmCanReadCwd, getDependencies, installPackages, isSafeToCreateProjectIn, shouldUseYarn } from './helpers';

// tslint:disable-next-line:no-var-requires
const packageJson = require('../package.json');
const REQUIRED_NODE_VERSION = '>=8.9.0';
checkNodeVersion(REQUIRED_NODE_VERSION);

let projectName: string | undefined;

program
    .version(packageJson.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')} [options]`)
    .action(name => {
        projectName = name;
    })
    .option('--verbose', 'print additional logs')
    .option('--use-npm')
    .parse(process.argv);

createApp(projectName, program.useNpm, program.verbose);

async function createApp(name: string | undefined, useNpm: boolean, verbose: boolean) {
    if (!runPreChecks(name, useNpm)) {
        return;
    }

    const root = path.resolve(name);
    const appName = path.basename(root);
    const { dbType, usingTs, configSource, indexSource, populateProducts } = await gatherUserResponses(root);

    const packageJsonContents = {
        name: appName,
        version: '0.1.0',
        private: true,
        scripts: {
            start: usingTs ? 'ts-node index.ts' : 'node index.js',
        },
    };
    const useYarn = useNpm ? false : shouldUseYarn();
    const originalDirectory = process.cwd();
    process.chdir(root);
    if (!useYarn && !checkThatNpmCanReadCwd()) {
        process.exit(1);
    }

    const tasks = new Listr([
        {
            title: 'Installing dependencies',
            task: async () => {
                fs.writeFileSync(
                    path.join(root, 'package.json'),
                    JSON.stringify(packageJsonContents, null, 2) + os.EOL,
                );
                const { dependencies, devDependencies } = getDependencies(usingTs, dbType);
                await installPackages(root, useYarn, dependencies, false, verbose);
                await installPackages(root, useYarn, devDependencies, true, verbose);
            },
        },
        {
            title: 'Generating app scaffold',
            task: async (ctx) => {
                const assetPath = (fileName: string) => path.join(__dirname, '../assets', fileName);
                const rootPathScript = (fileName: string): string => path.join(root, `${fileName}.${usingTs ? 'ts' : 'js'}`);
                ctx.configFile = rootPathScript('vendure-config');
                await fs.writeFile(ctx.configFile, configSource);
                await fs.writeFile(rootPathScript('index'), indexSource);
                if (usingTs) {
                    await fs.copyFile(assetPath('tsconfig.template.json'), path.join(root, 'tsconfig.json'));
                }
                await createDirectoryStructure(root);
                await copyEmailTemplates(root);
            },
        },
        {
            title: 'Initializing server',
            task: async (ctx) => {
                try {
                    if (usingTs) {
                        // register ts-node so that the config file can be loaded
                        require(path.join(root, 'node_modules/ts-node')).register();
                    }
                    const { populate } = await import(path.join(root, 'node_modules/@vendure/core/dist/cli/populate'));
                    const { bootstrap } = await import(path.join(root, 'node_modules/@vendure/core/dist/bootstrap'));
                    const { config } = await import(ctx.configFile);
                    const assetsDir = path.join(__dirname, '../assets');

                    const initialDataPath = path.join(assetsDir, 'initial-data.json');
                    const bootstrapFn = () => bootstrap({
                        ...config,
                        dbConnectionOptions: {
                            ...config.dbConnectionOptions,
                            synchronize: true,
                        },
                        importExportOptions: {
                            importAssetsDir: path.join(assetsDir, 'images'),
                        },
                    });
                    let app: any;
                    if (populateProducts) {
                        app = await populate(
                            bootstrapFn,
                            initialDataPath,
                            path.join(assetsDir, 'products.csv'),
                            path.join(assetsDir, 'images'),
                        );
                    } else {
                        app = await populate(
                            bootstrapFn,
                            initialDataPath,
                        );
                    }
                    await app.close();
                } catch (e) {
                    console.log(e);
                    throw e;
                }
            },
        },
    ]);

    try {
        await tasks.run();
    } catch (e) {
        console.error(chalk.red(e));
    }
    process.exit(0);
}

/**
 * Run some initial checks to ensure that it is okay to proceed with creating
 * a new Vendure project in the given location.
 */
function runPreChecks(name: string | undefined, useNpm: boolean): name is string {
    if (typeof name === 'undefined') {
        console.error('Please specify the project directory:');
        console.log(
            `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`,
        );
        console.log();
        console.log('For example:');
        console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-vendure-app')}`);
        process.exit(1);
        return false;
    }

    const root = path.resolve(name);
    fs.ensureDirSync(name);
    if (!isSafeToCreateProjectIn(root, name)) {
        process.exit(1);
    }
    console.log(`Creating a new Vendure app in ${chalk.green(root)}.`);
    console.log();
    return true;
}

/**
 * Generate the default directory structure for a new Vendure project
 */
async function createDirectoryStructure(root: string) {
    await fs.ensureDir(path.join(root, 'vendure', 'email', 'test-emails'));
    await fs.ensureDir(path.join(root, 'vendure', 'import-assets'));
    await fs.ensureDir(path.join(root, 'vendure', 'assets'));
}

/**
 * Copy the email templates into the app
 */
async function copyEmailTemplates(root: string) {
    const templateDir = path.join(root, 'node_modules/@vendure/email-plugin/templates');
    try {
        await fs.copy(templateDir, path.join(root, 'vendure', 'email', 'templates'));
    } catch (err) {
        console.error(chalk.red(`Failed to copy email templates.`));
    }
}
