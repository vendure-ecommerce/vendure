/* tslint:disable:no-console */
import chalk from 'chalk';
import program from 'commander';
import detectPort from 'detect-port';
import fs from 'fs-extra';
import Listr from 'listr';
import os from 'os';
import path from 'path';
import { Observable } from 'rxjs';

import { gatherCiUserResponses, gatherUserResponses } from './gather-user-responses';
import {
    checkDbConnection,
    checkNodeVersion,
    checkThatNpmCanReadCwd,
    getDependencies,
    installPackages,
    isSafeToCreateProjectIn,
    shouldUseYarn,
} from './helpers';
import { CliLogLevel } from './types';

// tslint:disable-next-line:no-var-requires
const packageJson = require('../package.json');
const REQUIRED_NODE_VERSION = '>=8.9.0';
checkNodeVersion(REQUIRED_NODE_VERSION);

let projectName: string | undefined;

// Set the environment variable which can then be used to
// conditionally modify behaviour of core or plugins.
const createEnvVar: import('@vendure/common/lib/shared-constants').CREATING_VENDURE_APP =
    'CREATING_VENDURE_APP';
process.env[createEnvVar] = 'true';

program
    .version(packageJson.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')} [options]`)
    .action(name => {
        projectName = name;
    })
    .option(
        '--log-level <logLevel>',
        "Log level, either 'silent', 'info', or 'verbose'",
        /^(silent|info|verbose)$/i,
        'silent',
    )
    .option('--use-npm', 'Uses npm rather than Yarn as the default package manager')
    .option('--ci', 'Runs without prompts for use in CI scenarios')
    .parse(process.argv);

createApp(projectName, program.useNpm, program.logLevel || 'silent', program.ci);

async function createApp(
    name: string | undefined,
    useNpm: boolean,
    logLevel: CliLogLevel,
    isCi: boolean = false,
) {
    if (!runPreChecks(name, useNpm)) {
        return;
    }

    console.log(`Welcome to @vendure/create v${packageJson.version}!`);
    console.log();
    console.log(`Let's configure a new Vendure project. First a few questions:`);
    console.log();

    const root = path.resolve(name);
    const appName = path.basename(root);
    const {
        dbType,
        usingTs,
        configSource,
        indexSource,
        indexWorkerSource,
        migrationSource,
        readmeSource,
        populateProducts,
    } = isCi ? await gatherCiUserResponses(root) : await gatherUserResponses(root);

    const useYarn = useNpm ? false : shouldUseYarn();
    const originalDirectory = process.cwd();
    process.chdir(root);
    if (!useYarn && !checkThatNpmCanReadCwd()) {
        process.exit(1);
    }

    const packageJsonContents = {
        name: appName,
        version: '0.1.0',
        private: true,
        scripts: {
            'run:server': usingTs ? 'ts-node ./src/index.ts' : 'node ./src/index.js',
            'run:worker': usingTs ? 'ts-node ./src/index-worker.ts' : 'node ./src/index-worker.js',
            start: useYarn ? 'concurrently yarn:run:*' : 'concurrently npm:run:*',
            ...(usingTs ? { build: 'tsc' } : undefined),
            'migration:generate': usingTs ? 'ts-node migration generate' : 'node migration generate',
            'migration:run': usingTs ? 'ts-node migration run' : 'node migration run',
            'migration:revert': usingTs ? 'ts-node migration revert' : 'node migration revert',
        },
    };

    console.log();
    console.log(`Setting up your new Vendure project in ${chalk.green(root)}`);
    console.log('This may take a few minutes...');
    console.log();

    const tasks = new Listr([
        {
            title: 'Installing dependencies',
            task: (() => {
                return new Observable(subscriber => {
                    subscriber.next('Creating package.json');
                    fs.writeFileSync(
                        path.join(root, 'package.json'),
                        JSON.stringify(packageJsonContents, null, 2) + os.EOL,
                    );
                    const { dependencies, devDependencies } = getDependencies(
                        usingTs,
                        dbType,
                        isCi ? `@${packageJson.version}` : '',
                    );

                    subscriber.next(`Installing ${dependencies.join(', ')}`);
                    installPackages(root, useYarn, dependencies, false, logLevel, isCi)
                        .then(() => {
                            if (devDependencies.length) {
                                subscriber.next(`Installing ${devDependencies.join(', ')}`);
                                return installPackages(root, useYarn, devDependencies, true, logLevel);
                            }
                        })
                        .then(() => subscriber.complete())
                        .catch(err => subscriber.error(err));
                });
            }) as any,
        },
        {
            title: 'Generating app scaffold',
            task: ctx => {
                return new Observable(subscriber => {
                    fs.ensureDirSync(path.join(root, 'src'));
                    const assetPath = (fileName: string) => path.join(__dirname, '../assets', fileName);
                    const srcPathScript = (fileName: string): string =>
                        path.join(root, 'src', `${fileName}.${usingTs ? 'ts' : 'js'}`);
                    const rootPathScript = (fileName: string): string =>
                        path.join(root, `${fileName}.${usingTs ? 'ts' : 'js'}`);
                    ctx.configFile = srcPathScript('vendure-config');

                    fs.writeFile(ctx.configFile, configSource)
                        .then(() => fs.writeFile(srcPathScript('index'), indexSource))
                        .then(() => fs.writeFile(srcPathScript('index-worker'), indexWorkerSource))
                        .then(() => fs.writeFile(rootPathScript('migration'), migrationSource))
                        .then(() => fs.writeFile(path.join(root, 'README.md'), readmeSource))
                        .then(() =>
                            fs.copyFile(assetPath('gitignore.template'), path.join(root, '.gitignore')),
                        )
                        .then(() => {
                            subscriber.next(`Created files`);
                            if (usingTs) {
                                return fs.copyFile(
                                    assetPath('tsconfig.template.json'),
                                    path.join(root, 'tsconfig.json'),
                                );
                            }
                        })
                        .then(() => createDirectoryStructure(root))
                        .then(() => {
                            subscriber.next(`Created directory structure`);
                            return copyEmailTemplates(root);
                        })
                        .then(() => {
                            subscriber.next(`Copied email templates`);
                            subscriber.complete();
                        })
                        .catch(err => subscriber.error(err));
                });
            },
        },
        {
            title: 'Initializing server',
            task: async ctx => {
                try {
                    if (usingTs) {
                        // register ts-node so that the config file can be loaded
                        require(path.join(root, 'node_modules/ts-node')).register();
                    }
                    const { populate } = await import(
                        path.join(root, 'node_modules/@vendure/core/cli/populate')
                    );
                    const { bootstrap, DefaultLogger, LogLevel } = await import(
                        path.join(root, 'node_modules/@vendure/core/dist/index')
                    );
                    const { config } = await import(ctx.configFile);
                    const assetsDir = path.join(__dirname, '../assets');

                    const initialDataPath = path.join(assetsDir, 'initial-data.json');
                    const port = await detectPort(3000);
                    const vendureLogLevel =
                        logLevel === 'silent'
                            ? LogLevel.Error
                            : logLevel === 'verbose'
                            ? LogLevel.Verbose
                            : LogLevel.Info;
                    const bootstrapFn = async () => {
                        await checkDbConnection(config.dbConnectionOptions, root);
                        return bootstrap({
                            ...config,
                            port,
                            silent: logLevel === 'silent',
                            dbConnectionOptions: {
                                ...config.dbConnectionOptions,
                                synchronize: true,
                            },
                            logger: new DefaultLogger({ level: vendureLogLevel }),
                            workerOptions: {
                                runInMainProcess: true,
                            },
                            importExportOptions: {
                                importAssetsDir: path.join(assetsDir, 'images'),
                            },
                        });
                    };
                    let app: any;
                    if (populateProducts) {
                        app = await populate(
                            bootstrapFn,
                            initialDataPath,
                            path.join(assetsDir, 'products.csv'),
                        );
                    } else {
                        app = await populate(bootstrapFn, initialDataPath);
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
        console.error(chalk.red(JSON.stringify(e)));
        process.exit(1);
    }
    const startCommand = useYarn ? 'yarn start' : 'npm run start';
    console.log();
    console.log(chalk.green(`Success! Created a new Vendure server at ${root}`));
    console.log();
    console.log(`We suggest that you start by typing:`);
    console.log();
    console.log(chalk.green(`    cd ${name}`));
    console.log(chalk.green(`    ${startCommand}`));
    console.log();
    console.log('Happy hacking!');
    process.exit(0);
}

/**
 * Run some initial checks to ensure that it is okay to proceed with creating
 * a new Vendure project in the given location.
 */
function runPreChecks(name: string | undefined, useNpm: boolean): name is string {
    if (typeof name === 'undefined') {
        console.error('Please specify the project directory:');
        console.log(`  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`);
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
    return true;
}

/**
 * Generate the default directory structure for a new Vendure project
 */
async function createDirectoryStructure(root: string) {
    await fs.ensureDir(path.join(root, 'static', 'email', 'test-emails'));
    await fs.ensureDir(path.join(root, 'static', 'assets'));
}

/**
 * Copy the email templates into the app
 */
async function copyEmailTemplates(root: string) {
    const templateDir = path.join(root, 'node_modules/@vendure/email-plugin/templates');
    try {
        await fs.copy(templateDir, path.join(root, 'static', 'email', 'templates'));
    } catch (err) {
        console.error(chalk.red(`Failed to copy email templates.`));
    }
}
