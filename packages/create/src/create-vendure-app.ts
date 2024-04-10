/* eslint-disable no-console */
import { intro, note, outro, select, spinner } from '@clack/prompts';
import { program } from 'commander';
import detectPort from 'detect-port';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import pc from 'picocolors';

import { REQUIRED_NODE_VERSION, SERVER_PORT } from './constants';
import { checkCancel, gatherCiUserResponses, gatherUserResponses } from './gather-user-responses';
import {
    checkDbConnection,
    checkNodeVersion,
    checkThatNpmCanReadCwd,
    getDependencies,
    installPackages,
    isSafeToCreateProjectIn,
    isServerPortInUse,
    scaffoldAlreadyExists,
    yarnIsAvailable,
} from './helpers';
import { CliLogLevel, DbType, PackageManager } from './types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../package.json');
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
    .usage(`${pc.green('<project-directory>')} [options]`)
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

const options = program.opts();
void createVendureApp(projectName, options.useNpm, options.logLevel || 'silent', options.ci);

export async function createVendureApp(
    name: string | undefined,
    useNpm: boolean,
    logLevel: CliLogLevel,
    isCi: boolean = false,
) {
    if (!runPreChecks(name, useNpm)) {
        return;
    }
    if (await isServerPortInUse()) {
        console.log(pc.red(`Port ${SERVER_PORT} is in use. Please make it available and then re-try.`));
        process.exit(1);
    }

    intro(
        `Let's create a ${pc.blue(pc.bold('Vendure App'))} ✨ ${pc.dim(`v${packageJson.version as string}`)}`,
    );

    const root = path.resolve(name);
    const appName = path.basename(root);
    const scaffoldExists = scaffoldAlreadyExists(root, name);

    const yarnAvailable = yarnIsAvailable();
    let packageManager: PackageManager = 'npm';
    if (yarnAvailable && !useNpm) {
        packageManager = (await select({
            message: 'Which package manager should be used?',
            options: [
                { label: 'npm', value: 'npm' },
                { label: 'yarn', value: 'yarn' },
            ],
            initialValue: 'yarn' as PackageManager,
        })) as PackageManager;
        checkCancel(packageManager);
    }

    if (scaffoldExists) {
        console.log(
            pc.yellow(
                'It appears that a new Vendure project scaffold already exists. Re-using the existing files...',
            ),
        );
        console.log();
    }
    const {
        dbType,
        configSource,
        envSource,
        envDtsSource,
        indexSource,
        indexWorkerSource,
        readmeSource,
        dockerfileSource,
        dockerComposeSource,
        populateProducts,
    } = isCi
        ? await gatherCiUserResponses(root, packageManager)
        : await gatherUserResponses(root, scaffoldExists, packageManager);
    const originalDirectory = process.cwd();
    process.chdir(root);
    if (packageManager !== 'npm' && !checkThatNpmCanReadCwd()) {
        process.exit(1);
    }

    const packageJsonContents = {
        name: appName,
        version: '0.1.0',
        private: true,
        scripts: {
            'dev:server': 'ts-node ./src/index.ts',
            'dev:worker': 'ts-node ./src/index-worker.ts',
            dev: packageManager === 'yarn' ? 'concurrently yarn:dev:*' : 'concurrently npm:dev:*',
            build: 'tsc',
            'start:server': 'node ./dist/index.js',
            'start:worker': 'node ./dist/index-worker.js',
            start: packageManager === 'yarn' ? 'concurrently yarn:start:*' : 'concurrently npm:start:*',
        },
    };

    const setupSpinner = spinner();
    setupSpinner.start(
        `Setting up your new Vendure project in ${pc.green(root)}\nThis may take a few minutes...`,
    );

    const rootPathScript = (fileName: string): string => path.join(root, `${fileName}.ts`);
    const srcPathScript = (fileName: string): string => path.join(root, 'src', `${fileName}.ts`);

    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJsonContents, null, 2) + os.EOL);
    const { dependencies, devDependencies } = getDependencies(dbType, `@${packageJson.version as string}`);
    setupSpinner.stop(`Created ${pc.green('package.json')}`);

    const installSpinner = spinner();
    installSpinner.start(`Installing ${dependencies[0]} + ${dependencies.length - 1} more dependencies`);
    try {
        await installPackages(root, packageManager === 'yarn', dependencies, false, logLevel, isCi);
    } catch (e) {
        outro(pc.red(`Failed to install dependencies. Please try again.`));
        process.exit(1);
    }
    installSpinner.stop(`Successfully installed ${dependencies.length} dependencies`);

    if (devDependencies.length) {
        const installDevSpinner = spinner();
        installDevSpinner.start(
            `Installing ${devDependencies[0]} + ${devDependencies.length - 1} more dev dependencies`,
        );
        try {
            await installPackages(root, packageManager === 'yarn', devDependencies, true, logLevel, isCi);
        } catch (e) {
            outro(pc.red(`Failed to install dev dependencies. Please try again.`));
            process.exit(1);
        }
        installDevSpinner.stop(`Successfully installed ${devDependencies.length} dev dependencies`);
    }

    const scaffoldSpinner = spinner();
    scaffoldSpinner.start(`Generating app scaffold`);
    fs.ensureDirSync(path.join(root, 'src'));
    const assetPath = (fileName: string) => path.join(__dirname, '../assets', fileName);
    const configFile = srcPathScript('vendure-config');

    try {
        await fs
            .writeFile(configFile, configSource)
            .then(() => fs.writeFile(path.join(root, '.env'), envSource))
            .then(() => fs.writeFile(srcPathScript('environment.d'), envDtsSource))
            .then(() => fs.writeFile(srcPathScript('index'), indexSource))
            .then(() => fs.writeFile(srcPathScript('index-worker'), indexWorkerSource))
            .then(() => fs.writeFile(path.join(root, 'README.md'), readmeSource))
            .then(() => fs.writeFile(path.join(root, 'Dockerfile'), dockerfileSource))
            .then(() => fs.writeFile(path.join(root, 'docker-compose.yml'), dockerComposeSource))
            .then(() => fs.mkdir(path.join(root, 'src/plugins')))
            .then(() => fs.copyFile(assetPath('gitignore.template'), path.join(root, '.gitignore')))
            .then(() => fs.copyFile(assetPath('tsconfig.template.json'), path.join(root, 'tsconfig.json')))
            .then(() => createDirectoryStructure(root))
            .then(() => copyEmailTemplates(root));
    } catch (e) {
        outro(pc.red(`Failed to create app scaffold. Please try again.`));
        process.exit(1);
    }
    scaffoldSpinner.stop(`Generated app scaffold`);

    const populateSpinner = spinner();
    populateSpinner.start(`Initializing your new Vendure server`);
    // register ts-node so that the config file can be loaded
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require(path.join(root, 'node_modules/ts-node')).register();

    try {
        const { populate } = await import(path.join(root, 'node_modules/@vendure/core/cli/populate'));
        const { bootstrap, DefaultLogger, LogLevel, JobQueueService } = await import(
            path.join(root, 'node_modules/@vendure/core/dist/index')
        );
        const { config } = await import(configFile);
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
            const _app = await bootstrap({
                ...config,
                apiOptions: {
                    ...(config.apiOptions ?? {}),
                    port,
                },
                silent: logLevel === 'silent',
                dbConnectionOptions: {
                    ...config.dbConnectionOptions,
                    synchronize: true,
                },
                logger: new DefaultLogger({ level: vendureLogLevel }),
                importExportOptions: {
                    importAssetsDir: path.join(assetsDir, 'images'),
                },
            });
            await _app.get(JobQueueService).start();
            return _app;
        };

        const app = await populate(
            bootstrapFn,
            initialDataPath,
            populateProducts ? path.join(assetsDir, 'products.csv') : undefined,
        );

        // Pause to ensure the worker jobs have time to complete.
        if (isCi) {
            console.log('[CI] Pausing before close...');
        }
        await new Promise(resolve => setTimeout(resolve, isCi ? 30000 : 2000));
        await app.close();
        if (isCi) {
            console.log('[CI] Pausing after close...');
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    } catch (e) {
        console.log(e);
        outro(pc.red(`Failed to initialize server. Please try again.`));
        process.exit(1);
    }
    populateSpinner.stop(`Server successfully initialized${populateProducts ? ' and populated' : ''}`);

    const startCommand = packageManager === 'yarn' ? 'yarn dev' : 'npm run dev';
    const nextSteps = [
        `${pc.green('Success!')} Created a new Vendure server at:`,
        `\n`,
        pc.italic(root),
        `\n`,
        `We suggest that you start by typing:`,
        `\n`,
        pc.gray('$ ') + pc.blue(pc.bold(`cd ${name}`)),
        pc.gray('$ ') + pc.blue(pc.bold(`${startCommand}`)),
    ];
    note(nextSteps.join('\n'));
    outro(`Happy hacking!`);
    process.exit(0);
}

/**
 * Run some initial checks to ensure that it is okay to proceed with creating
 * a new Vendure project in the given location.
 */
function runPreChecks(name: string | undefined, useNpm: boolean): name is string {
    if (typeof name === 'undefined') {
        console.error('Please specify the project directory:');
        console.log(`  ${pc.cyan(program.name())} ${pc.green('<project-directory>')}`);
        console.log();
        console.log('For example:');
        console.log(`  ${pc.cyan(program.name())} ${pc.green('my-vendure-app')}`);
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
    } catch (err: any) {
        console.error(pc.red('Failed to copy email templates.'));
    }
}
