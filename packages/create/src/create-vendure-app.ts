import { intro, note, outro, select, spinner } from '@clack/prompts';
import { program } from 'commander';
import { randomBytes } from 'crypto';
import fs from 'fs-extra';
import Handlebars from 'handlebars';
import { ChildProcess, spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import open from 'open';
import os from 'os';
import path from 'path';
import pc from 'picocolors';

import { REQUIRED_NODE_VERSION, SERVER_PORT, STOREFRONT_PORT } from './constants';
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
    downloadAndExtractStorefront,
    getDependencies,
    installPackages,
    isSafeToCreateProjectIn,
    isServerPortInUse,
    resolvePackageRootDir,
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
    .option('--with-storefront', 'Include Next.js storefront (only used with --ci)', false)
    .parse(process.argv);

const options = program.opts();
void createVendureApp(
    projectName,
    options.useNpm,
    options.verbose ? 'verbose' : options.logLevel || 'info',
    options.ci,
    options.withStorefront,
).catch(err => {
    log(err);
    process.exit(1);
});

export async function createVendureApp(
    name: string | undefined,
    useNpm: boolean,
    logLevel: CliLogLevel,
    isCi: boolean = false,
    withStorefront: boolean = false,
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
        includeStorefront,
    } =
        mode === 'ci'
            ? await getCiConfiguration(root, packageManager, withStorefront)
            : mode === 'manual'
              ? await getManualConfiguration(root, packageManager)
              : await getQuickStartConfiguration(root, packageManager);
    // Determine the server root directory (either root or apps/server for monorepo)
    const serverRoot = includeStorefront ? path.join(root, 'apps', 'server') : root;
    const storefrontRoot = path.join(root, 'apps', 'storefront');
    const storefrontPort = STOREFRONT_PORT;

    process.chdir(root);
    if (packageManager !== 'npm' && !checkThatNpmCanReadCwd()) {
        process.exit(1);
    }

    const setupSpinner = spinner();
    if (includeStorefront) {
        setupSpinner.start(
            `Setting up your new Vendure monorepo in ${pc.green(root)}\nThis may take a few minutes...`,
        );
    } else {
        setupSpinner.start(
            `Setting up your new Vendure project in ${pc.green(root)}\nThis may take a few minutes...`,
        );
    }

    const assetPath = (fileName: string) => path.join(__dirname, '../assets', fileName);
    const templatePath = (fileName: string) => path.join(__dirname, '../assets/monorepo', fileName);

    if (includeStorefront) {
        // Create monorepo structure
        await fs.ensureDir(path.join(root, 'apps'));
        await fs.ensureDir(serverRoot);
        await fs.ensureDir(path.join(serverRoot, 'src'));

        // Generate root package.json from template
        const rootPackageTemplate = await fs.readFile(templatePath('root-package.json.hbs'), 'utf-8');
        const rootPackageContent = Handlebars.compile(rootPackageTemplate)({ name: appName });
        fs.writeFileSync(path.join(root, 'package.json'), rootPackageContent + os.EOL);

        // Generate root README from template
        const rootReadmeTemplate = await fs.readFile(templatePath('root-readme.hbs'), 'utf-8');
        const rootReadmeContent = Handlebars.compile(rootReadmeTemplate)({
            name: appName,
            serverPort: port,
            storefrontPort,
            superadminIdentifier: 'superadmin',
            superadminPassword: 'superadmin',
        });
        fs.writeFileSync(path.join(root, 'README.md'), rootReadmeContent);

        // Create server package.json
        const serverPackageJsonContents = {
            name: `@${appName}/server`,
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
        fs.writeFileSync(
            path.join(serverRoot, 'package.json'),
            JSON.stringify(serverPackageJsonContents, null, 2) + os.EOL,
        );
    } else {
        // Single project structure (original behavior)
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
        fs.writeFileSync(
            path.join(root, 'package.json'),
            JSON.stringify(packageJsonContents, null, 2) + os.EOL,
        );
        fs.ensureDirSync(path.join(root, 'src'));
    }

    setupSpinner.stop(`Created ${pc.green('package.json')}`);

    // Download storefront if needed
    if (includeStorefront) {
        const storefrontSpinner = spinner();
        storefrontSpinner.start(`Downloading Next.js storefront...`);
        try {
            await downloadAndExtractStorefront(storefrontRoot);

            // Remove bun.lock since we use npm for installation
            const bunLockPath = path.join(storefrontRoot, 'bun.lock');
            if (fs.existsSync(bunLockPath)) {
                fs.unlinkSync(bunLockPath);
            }

            // Generate storefront .env.local from template
            const storefrontEnvTemplate = await fs.readFile(templatePath('storefront-env.hbs'), 'utf-8');
            const storefrontEnvContent = Handlebars.compile(storefrontEnvTemplate)({
                serverPort: port,
                storefrontPort,
                name: appName,
                revalidationSecret: randomBytes(32).toString('base64'),
            });
            fs.writeFileSync(path.join(storefrontRoot, '.env.local'), storefrontEnvContent);

            storefrontSpinner.stop(`Downloaded Next.js storefront`);
        } catch (e: any) {
            storefrontSpinner.stop(pc.red(`Failed to download storefront`));
            log(e.message, { level: 'verbose' });
            outro(pc.red(`Failed to download storefront: ${e.message as string}`));
            process.exit(1);
        }
    }

    // Install dependencies
    const { dependencies, devDependencies } = getDependencies(dbType, `@${packageJson.version as string}`);

    if (includeStorefront) {
        // For monorepo, we change to server directory to install server deps
        process.chdir(serverRoot);
    }

    const installSpinner = spinner();
    installSpinner.start(`Installing ${dependencies[0]} + ${dependencies.length - 1} more dependencies`);
    try {
        await installPackages({ dependencies, logLevel });
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
            await installPackages({ dependencies: devDependencies, isDevDependencies: true, logLevel });
        } catch (e) {
            outro(pc.red(`Failed to install dev dependencies. Please try again.`));
            process.exit(1);
        }
        installDevSpinner.stop(`Successfully installed ${devDependencies.length} dev dependencies`);
    }

    if (includeStorefront) {
        // Install storefront dependencies
        process.chdir(storefrontRoot);
        const storefrontInstallSpinner = spinner();
        storefrontInstallSpinner.start(`Installing storefront dependencies...`);
        try {
            await installPackages({ dependencies: [], logLevel }); // npm install with no specific deps
            storefrontInstallSpinner.stop(`Installed storefront dependencies`);
        } catch (e) {
            storefrontInstallSpinner.stop(pc.yellow(`Warning: Failed to install storefront dependencies`));
            log('You may need to run npm install in the storefront directory manually.', { level: 'info' });
        } finally {
            // Change back to root for the rest of the setup
            process.chdir(root);
        }
    }

    const scaffoldSpinner = spinner();
    scaffoldSpinner.start(`Generating app scaffold`);
    // We add this pause so that the above output is displayed before the
    // potentially lengthy file operations begin, which can prevent that
    // from displaying and thus make the user think that the process has hung.
    await sleep(500);

    const srcPathScript = (fileName: string): string => path.join(serverRoot, 'src', `${fileName}.ts`);

    if (!includeStorefront) {
        fs.ensureDirSync(path.join(serverRoot, 'src'));
    }

    const configFile = srcPathScript('vendure-config');

    try {
        await fs
            .writeFile(configFile, configSource)
            .then(() => fs.writeFile(path.join(serverRoot, '.env'), envSource))
            .then(() => fs.writeFile(srcPathScript('environment.d'), envDtsSource))
            .then(() => fs.writeFile(srcPathScript('index'), indexSource))
            .then(() => fs.writeFile(srcPathScript('index-worker'), indexWorkerSource))
            .then(() => {
                // Only write README to server root if not a monorepo (monorepo has root README)
                if (!includeStorefront) {
                    return fs.writeFile(path.join(serverRoot, 'README.md'), readmeSource);
                }
            })
            .then(() => fs.writeFile(path.join(serverRoot, 'Dockerfile'), dockerfileSource))
            .then(() => fs.writeFile(path.join(serverRoot, 'docker-compose.yml'), dockerComposeSource))
            .then(() => fs.ensureDir(path.join(serverRoot, 'src/plugins')))
            .then(() => fs.copyFile(assetPath('gitignore.template'), path.join(serverRoot, '.gitignore')))
            .then(() =>
                fs.copyFile(assetPath('tsconfig.template.json'), path.join(serverRoot, 'tsconfig.json')),
            )
            .then(() =>
                fs.copyFile(
                    assetPath('tsconfig.dashboard.template.json'),
                    path.join(serverRoot, 'tsconfig.dashboard.json'),
                ),
            )
            .then(() =>
                fs.copyFile(assetPath('vite.config.template.mts'), path.join(serverRoot, 'vite.config.mts')),
            )
            .then(() => createDirectoryStructure(serverRoot))
            .then(() => copyEmailTemplates(serverRoot));
    } catch (e: any) {
        outro(pc.red(`Failed to create app scaffold: ${e.message as string}`));
        process.exit(1);
    }
    scaffoldSpinner.stop(`Generated app scaffold`);

    if (mode === 'quick' && dbType === 'postgres') {
        cleanUpDockerResources(name);
        await startPostgresDatabase(serverRoot);
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
    require(resolvePackageRootDir('ts-node', serverRoot)).register();

    let superAdminCredentials: { identifier: string; password: string } | undefined;
    try {
        const { populate } = await import(
            path.join(resolvePackageRootDir('@vendure/core', serverRoot), 'cli', 'populate')
        );
        const { bootstrap, DefaultLogger, LogLevel, JobQueueService } = await import(
            path.join(resolvePackageRootDir('@vendure/core', serverRoot), 'dist', 'index')
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
            await checkDbConnection(config.dbConnectionOptions, serverRoot);
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
            // a browser window to the Dashboard.
            try {
                const dashboardUrl = `http://localhost:${port}/dashboard`;
                const quickStartInstructions = [
                    'Use the following credentials to log in to the Dashboard:',
                    `Username: ${pc.green(config.authOptions.superadminCredentials?.identifier)}`,
                    `Password: ${pc.green(config.authOptions.superadminCredentials?.password)}`,
                    `Open your browser and navigate to: ${pc.green(dashboardUrl)}`,
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
                    displayOutro({
                        root,
                        name,
                        superAdminCredentials,
                        includeStorefront,
                        serverPort: port,
                        storefrontPort,
                    });
                    quickStartProcess?.kill('SIGINT');
                    process.exit(0);
                });

                // Give enough time for the server to get up and running
                // before opening the window.
                await sleep(10_000);
                try {
                    await open(dashboardUrl, {
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
            displayOutro({
                root,
                name,
                superAdminCredentials,
                includeStorefront,
                serverPort: port,
                storefrontPort,
            });
            process.exit(0);
        }
    } catch (e: any) {
        log(e.toString());
        outro(pc.red(`Failed to initialize server. Please try again.`));
        process.exit(1);
    }
}

interface OutroOptions {
    root: string;
    name: string;
    superAdminCredentials?: { identifier: string; password: string };
    includeStorefront?: boolean;
    serverPort?: number;
    storefrontPort?: number;
}

// eslint-disable-next-line @typescript-eslint/no-shadow
function displayOutro(options: OutroOptions) {
    const {
        root,
        name,
        superAdminCredentials,
        includeStorefront,
        serverPort = 3000,
        storefrontPort = 4000,
    } = options;
    const startCommand = 'npm run dev';

    if (includeStorefront) {
        const nextSteps = [
            `Your new Vendure project was created!`,
            pc.gray(root),
            `\n`,
            `This is a monorepo with the following apps:`,
            `  ${pc.cyan('apps/server')}     - Vendure backend`,
            `  ${pc.cyan('apps/storefront')} - Next.js frontend`,
            `\n`,
            `Next, run:`,
            pc.gray('$ ') + pc.blue(pc.bold(`cd ${name}`)),
            pc.gray('$ ') + pc.blue(pc.bold(`${startCommand}`)),
            `\n`,
            `This will start both the server and storefront.`,
            `\n`,
            `Access points:`,
            `  Dashboard:  ${pc.green(`http://localhost:${serverPort}/dashboard`)}`,
            `  Storefront: ${pc.green(`http://localhost:${storefrontPort}`)}`,
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
    } else {
        const nextSteps = [
            `Your new Vendure server was created!`,
            pc.gray(root),
            `\n`,
            `Next, run:`,
            pc.gray('$ ') + pc.blue(pc.bold(`cd ${name}`)),
            pc.gray('$ ') + pc.blue(pc.bold(`${startCommand}`)),
            `\n`,
            `This will start the server in development mode.`,
            `\n`,
            `To run the Dashboard, in a new terminal navigate to your project directory and run:`,
            pc.gray('$ ') + pc.blue(pc.bold(`npx vite`)),
            `\n`,
            `To access the Dashboard, open your browser and navigate to:`,
            pc.green(`http://localhost:${serverPort}/dashboard`),
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
    }
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
    const emailPackageDirname = resolvePackageRootDir('@vendure/email-plugin', root);
    const templateDir = path.join(emailPackageDirname, 'templates');
    try {
        await fs.copy(templateDir, path.join(root, 'static', 'email', 'templates'));
    } catch (err: any) {
        log(pc.red('Failed to copy email templates.'));
        log(err);
        process.exit(0);
    }
}
