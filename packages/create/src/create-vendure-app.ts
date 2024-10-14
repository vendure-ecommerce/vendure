import { intro, note, outro, select, spinner } from '@clack/prompts';
import { program } from 'commander';
import fs from 'fs-extra';
import { ChildProcess, spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import open from 'open';
import os from 'os';
import path from 'path';
import pc from 'picocolors';

import { REQUIRED_NODE_VERSION, SERVER_PORT } from './constants';
import {
    getCiConfiguration,
    getManualConfiguration,
    getQuickStartConfiguration,
} from './gather-user-responses';
import {
    checkCancel,
    checkDbConnection,
    checkNodeVersion,
    checkThatNpmCanReadCwd,
    cleanUpDockerResources,
    getDependencies,
    installPackages,
    isSafeToCreateProjectIn,
    isServerPortInUse,
    scaffoldAlreadyExists,
    startPostgresDatabase,
} from './helpers';
import { log, setLogLevel } from './logger';
import { CliLogLevel, PackageManager } from './types';

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
        'info',
    )
    .option('--verbose', 'Alias for --log-level verbose', false)
    .option(
        '--use-npm',
        'Uses npm rather than as the default package manager. DEPRECATED: Npm is now the default',
    )
    .option('--ci', 'Runs without prompts for use in CI scenarios', false)
    .parse(process.argv);

const options = program.opts();
void createVendureApp(
    projectName,
    options.useNpm,
    options.verbose ? 'verbose' : options.logLevel || 'info',
    options.ci,
);

export async function createVendureApp(
    name: string | undefined,
    useNpm: boolean,
    logLevel: CliLogLevel,
    isCi: boolean = false,
) {
    setLogLevel(logLevel);
    if (!runPreChecks(name, useNpm)) {
        return;
    }

    intro(
        `Let's create a ${pc.blue(pc.bold('Vendure App'))} ✨ ${pc.dim(`v${packageJson.version as string}`)}`,
    );

    const mode = isCi
        ? 'ci'
        : ((await select({
              message: 'How should we proceed?',
              options: [
                  { label: 'Quick Start', value: 'quick', hint: 'Get up an running in a single step' },
                  {
                      label: 'Manual Configuration',
                      value: 'manual',
                      hint: 'Customize your Vendure project with more advanced settings',
                  },
              ],
              initialValue: 'quick' as 'quick' | 'manual',
          })) as 'quick' | 'manual');
    checkCancel(mode);

    const portSpinner = spinner();
    let port = SERVER_PORT;
    const attemptedPortRange = 20;
    portSpinner.start(`Establishing port...`);
    while (await isServerPortInUse(port)) {
        const nextPort = port + 1;
        portSpinner.message(pc.yellow(`Port ${port} is in use. Attempting to use ${nextPort}`));
        port = nextPort;
        if (port > SERVER_PORT + attemptedPortRange) {
            portSpinner.stop(pc.red('Could not find an available port'));
            outro(
                `Please ensure there is a port available between ${SERVER_PORT} and ${SERVER_PORT + attemptedPortRange}`,
            );
            process.exit(1);
        }
    }
    portSpinner.stop(`Using port ${port}`);
    process.env.PORT = port.toString();

    const root = path.resolve(name);
    const appName = path.basename(root);
    const scaffoldExists = scaffoldAlreadyExists(root, name);

    const packageManager: PackageManager = 'npm';

    if (scaffoldExists) {
        log(
            pc.yellow(
                'It appears that a new Vendure project scaffold already exists. Re-using the existing files...',
            ),
            { newline: 'after' },
        );
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
    } =
        mode === 'ci'
            ? await getCiConfiguration(root, packageManager)
            : mode === 'manual'
              ? await getManualConfiguration(root, packageManager)
              : await getQuickStartConfiguration(root, packageManager);
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
            dev: 'concurrently npm:dev:*',
            build: 'tsc',
            'start:server': 'node ./dist/index.js',
            'start:worker': 'node ./dist/index-worker.js',
            start: 'concurrently npm:start:*',
        },
    };

    const setupSpinner = spinner();
    setupSpinner.start(
        `Setting up your new Vendure project in ${pc.green(root)}\nThis may take a few minutes...`,
    );

    const srcPathScript = (fileName: string): string => path.join(root, 'src', `${fileName}.ts`);

    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJsonContents, null, 2) + os.EOL);
    const { dependencies, devDependencies } = getDependencies(dbType, `@${packageJson.version as string}`);
    setupSpinner.stop(`Created ${pc.green('package.json')}`);

    const installSpinner = spinner();
    installSpinner.start(`Installing ${dependencies[0]} + ${dependencies.length - 1} more dependencies`);
    try {
        await installPackages({ dependencies, logLevel });
    } catch (e) {
        outro(pc.red(`Failed to inst all dependencies. Please try again.`));
        process.exit(1);
    }
    installSpinner.stop(`Successfully installed ${dependencies.length} dependencies`);

    if (devDependencies.length) {
        const installDevSpinner = spinner();
        installDevSpinner.start(
            `Installing ${devDependencies[0]} + ${devDependencies.length - 1} more dev dependencies`,
        );
        try {
            await installPackages({ dependencies: devDependencies, isDevDependencies: true, logLevel });
        } catch (e) {
            outro(pc.red(`Failed to install dev dependencies. Please try again.`));
            process.exit(1);
        }
        installDevSpinner.stop(`Successfully installed ${devDependencies.length} dev dependencies`);
    }

    const scaffoldSpinner = spinner();
    scaffoldSpinner.start(`Generating app scaffold`);
    // We add this pause so that the above output is displayed before the
    // potentially lengthy file operations begin, which can prevent that
    // from displaying and thus make the user think that the process has hung.
    await sleep(500);
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
            .then(() => fs.ensureDir(path.join(root, 'src/plugins')))
            .then(() => fs.copyFile(assetPath('gitignore.template'), path.join(root, '.gitignore')))
            .then(() => fs.copyFile(assetPath('tsconfig.template.json'), path.join(root, 'tsconfig.json')))
            .then(() => createDirectoryStructure(root))
            .then(() => copyEmailTemplates(root));
    } catch (e: any) {
        outro(pc.red(`Failed to create app scaffold: ${e.message as string}`));
        process.exit(1);
    }
    scaffoldSpinner.stop(`Generated app scaffold`);

    if (mode === 'quick' && dbType === 'postgres') {
        cleanUpDockerResources(name);
        await startPostgresDatabase(root);
    }

    const populateSpinner = spinner();
    populateSpinner.start(`Initializing your new Vendure server`);

    // We want to display a set of tips and instructions to the user
    // as the initialization process is running because it can take
    // a few minutes to complete.
    const tips = [
        populateProducts
            ? 'We are populating sample data so that you can start testing right away'
            : 'We are setting up your Vendure server',
        '☕ This can take a minute or two, so grab a coffee',
        `✨ We'd love it if you drop us a star on GitHub: https://github.com/vendure-ecommerce/vendure`,
        `📖 Check out the Vendure documentation at https://docs.vendure.io`,
        `💬 Join our Discord community to chat with other Vendure developers: https://vendure.io/community`,
        '💡 In the mean time, here are some tips to get you started',
        `Vendure provides dedicated GraphQL APIs for both the Admin and Shop`,
        `Almost every aspect of Vendure is customizable via plugins`,
        `You can run 'vendure add' from the command line to add new plugins & features`,
        `Use the EventBus in your plugins to react to events in the system`,
        `Vendure supports multiple languages & currencies out of the box`,
        `☕ Did we mention this can take a while?`,
        `Our custom fields feature allows you to add any kind of data to your entities`,
        `Vendure is built with TypeScript, so you get full type safety`,
        `Combined with GraphQL's static schema, your type safety is end-to-end`,
        `☕ Almost there now... thanks for your patience!`,
        `Collections allow you to group products together`,
        `Our AssetServerPlugin allows you to dynamically resize & optimize images`,
        `Order flows are fully customizable to suit your business requirements`,
        `Role-based permissions allow you to control access to every part of the system`,
        `Customers can be grouped for targeted promotions & custom pricing`,
        `You can find integrations in the Vendure Hub: https://vendure.io/hub`,
    ];

    let tipIndex = 0;
    let timer: any;
    const tipInterval = 10_000;

    function displayTip() {
        populateSpinner.message(tips[tipIndex]);
        tipIndex++;
        if (tipIndex >= tips.length) {
            // skip the intro tips if looping
            tipIndex = 3;
        }
        timer = setTimeout(displayTip, tipInterval);
    }

    timer = setTimeout(displayTip, tipInterval);

    // register ts-node so that the config file can be loaded
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require(path.join(root, 'node_modules/ts-node')).register();

    let superAdminCredentials: { identifier: string; password: string } | undefined;
    try {
        const { populate } = await import(path.join(root, 'node_modules/@vendure/core/cli/populate'));
        const { bootstrap, DefaultLogger, LogLevel, JobQueueService, ConfigModule } = await import(
            path.join(root, 'node_modules/@vendure/core/dist/index')
        );
        const { config } = await import(configFile);
        const assetsDir = path.join(__dirname, '../assets');
        superAdminCredentials = config.authOptions.superadminCredentials;
        const initialDataPath = path.join(assetsDir, 'initial-data.json');
        const vendureLogLevel =
            logLevel === 'info' || logLevel === 'silent'
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
            log('[CI] Pausing before close...');
        }
        await sleep(isCi ? 30000 : 2000);
        await app.close();
        if (isCi) {
            log('[CI] Pausing after close...');
            await sleep(10000);
        }
        populateSpinner.stop(`Server successfully initialized${populateProducts ? ' and populated' : ''}`);
        clearTimeout(timer);
        /**
         * This is currently disabled because I am running into issues actually getting the server
         * to quite properly in response to a SIGINT.
         * This means that the server runs, but cannot be ended, without forcefully
         * killing the process.
         *
         * Once this has been resolved, the following code can be re-enabled by
         * setting `autoRunServer` to `true`.
         */
        const autoRunServer = false;
        if (mode === 'quick' && autoRunServer) {
            // In quick-start mode, we want to now run the server and open up
            // a browser window to the Admin UI.
            try {
                const adminUiUrl = `http://localhost:${port}/admin`;
                const quickStartInstructions = [
                    'Use the following credentials to log in to the Admin UI:',
                    `Username: ${pc.green(config.authOptions.superadminCredentials?.identifier)}`,
                    `Password: ${pc.green(config.authOptions.superadminCredentials?.password)}`,
                    `Open your browser and navigate to: ${pc.green(adminUiUrl)}`,
                    '',
                ];
                note(quickStartInstructions.join('\n'));

                const npmCommand = os.platform() === 'win32' ? 'npm.cmd' : 'npm';
                let quickStartProcess: ChildProcess | undefined;
                try {
                    quickStartProcess = spawn(npmCommand, ['run', 'dev'], {
                        cwd: root,
                        stdio: 'inherit',
                    });
                } catch (e: any) {
                    /* empty */
                }

                // process.stdin.resume();
                process.on('SIGINT', function () {
                    displayOutro(root, name, superAdminCredentials);
                    quickStartProcess?.kill('SIGINT');
                    process.exit(0);
                });

                // Give enough time for the server to get up and running
                // before opening the window.
                await sleep(10_000);
                try {
                    await open(adminUiUrl, {
                        newInstance: true,
                    });
                } catch (e: any) {
                    /* empty */
                }
            } catch (e: any) {
                log(pc.red(`Failed to start the server: ${e.message as string}`), {
                    newline: 'after',
                    level: 'verbose',
                });
            }
        } else {
            clearTimeout(timer);
            displayOutro(root, name, superAdminCredentials);
            process.exit(0);
        }
    } catch (e: any) {
        log(e.toString());
        outro(pc.red(`Failed to initialize server. Please try again.`));
        process.exit(1);
    }
}

function displayOutro(
    root: string,
    name: string,
    superAdminCredentials?: { identifier: string; password: string },
) {
    const startCommand = 'npm run dev';
    const nextSteps = [
        `Your new Vendure server was created!`,
        pc.gray(root),
        `\n`,
        `Next, run:`,
        pc.gray('$ ') + pc.blue(pc.bold(`cd ${name}`)),
        pc.gray('$ ') + pc.blue(pc.bold(`${startCommand}`)),
        `\n`,
        `This will start the server in development mode.`,
        `To access the Admin UI, open your browser and navigate to:`,
        `\n`,
        pc.green(`http://localhost:3000/admin`),
        `\n`,
        `Use the following credentials to log in:`,
        `Username: ${pc.green(superAdminCredentials?.identifier ?? 'superadmin')}`,
        `Password: ${pc.green(superAdminCredentials?.password ?? 'superadmin')}`,
        '\n',
        '➡️ Docs: https://docs.vendure.io',
        '➡️ Discord community: https://vendure.io/community',
        '➡️ Star us on GitHub:',
        '   https://github.com/vendure-ecommerce/vendure',
    ];
    note(nextSteps.join('\n'), pc.green('Setup complete!'));
    outro(`Happy hacking!`);
}

/**
 * Run some initial checks to ensure that it is okay to proceed with creating
 * a new Vendure project in the given location.
 */
function runPreChecks(name: string | undefined, useNpm: boolean): name is string {
    if (typeof name === 'undefined') {
        log(pc.red(`Please specify the project directory:`));
        log(`  ${pc.cyan(program.name())} ${pc.green('<project-directory>')}`, { newline: 'after' });
        log('For example:');
        log(`  ${pc.cyan(program.name())} ${pc.green('my-vendure-app')}`);
        process.exit(1);
        return false;
    }

    const root = path.resolve(name);
    try {
        fs.ensureDirSync(name);
    } catch (e: any) {
        log(pc.red(`Could not create project directory ${name}: ${e.message as string}`));
        return false;
    }
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
        log(pc.red('Failed to copy email templates.'));
    }
}
