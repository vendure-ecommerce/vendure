import { cancel, isCancel, spinner } from '@clack/prompts';
import spawn from 'cross-spawn';
import fs from 'fs-extra';
import { execFile, execSync, execFileSync } from 'node:child_process';
import { platform } from 'node:os';
import { promisify } from 'node:util';
import path from 'path';
import pc from 'picocolors';
import semver from 'semver';

import { TYPESCRIPT_VERSION } from './constants';
import { log } from './logger';
import { CliLogLevel, DbType } from './types';

/**
 * If project only contains files generated by GH, it’s safe.
 * Also, if project contains remnant error logs from a previous
 * installation, lets remove them now.
 * We also special case IJ-based products .idea because it integrates with CRA:
 * https://github.com/facebook/create-react-app/pull/368#issuecomment-243446094
 */
export function isSafeToCreateProjectIn(root: string, name: string) {
    // These files should be allowed to remain on a failed install,
    // but then silently removed during the next create.
    const errorLogFilePatterns = ['npm-debug.log', 'yarn-error.log', 'yarn-debug.log'];
    const validFiles = [
        '.DS_Store',
        'Thumbs.db',
        '.git',
        '.gitignore',
        '.idea',
        'README.md',
        'LICENSE',
        '.hg',
        '.hgignore',
        '.hgcheck',
        '.npmignore',
        'mkdocs.yml',
        'docs',
        '.travis.yml',
        '.gitlab-ci.yml',
        '.gitattributes',
        'migration.ts',
        'node_modules',
        'package.json',
        'package-lock.json',
        'src',
        'static',
        'tsconfig.json',
        'yarn.lock',
    ];

    const conflicts = fs
        .readdirSync(root)
        .filter(file => !validFiles.includes(file))
        // IntelliJ IDEA creates module files before CRA is launched
        .filter(file => !/\.iml$/.test(file))
        // Don't treat log files from previous installation as conflicts
        .filter(file => !errorLogFilePatterns.some(pattern => file.indexOf(pattern) === 0));

    if (conflicts.length > 0) {
        log(`The directory ${pc.green(name)} contains files that could conflict:`, { newline: 'after' });
        for (const file of conflicts) {
            log(`  ${file}`);
        }
        log('Either try using a new directory name, or remove the files listed above.', {
            newline: 'before',
        });

        return false;
    }

    // Remove any remnant files from a previous installation
    const currentFiles = fs.readdirSync(path.join(root));
    currentFiles.forEach(file => {
        errorLogFilePatterns.forEach(errorLogFilePattern => {
            // This will catch `(npm-debug|yarn-error|yarn-debug).log*` files
            if (file.indexOf(errorLogFilePattern) === 0) {
                fs.removeSync(path.join(root, file));
            }
        });
    });
    return true;
}

export function scaffoldAlreadyExists(root: string, name: string): boolean {
    const scaffoldFiles = ['migration.ts', 'package.json', 'tsconfig.json', 'README.md'];
    const files = fs.readdirSync(root);
    return scaffoldFiles.every(scaffoldFile => files.includes(scaffoldFile));
}

export function checkNodeVersion(requiredVersion: string) {
    if (!semver.satisfies(process.version, requiredVersion)) {
        log(
            pc.red(
                `You are running Node ${process.version}.` +
                    `Vendure requires Node ${requiredVersion} or higher.` +
                    'Please update your version of Node.',
            ),
        );
        process.exit(1);
    }
}

// Bun support should not be exposed yet, see
// https://github.com/oven-sh/bun/issues/4947
// https://github.com/lovell/sharp/issues/3511
export function bunIsAvailable() {
    try {
        execFileSync('bun', ['--version'], { stdio: 'ignore' });
        return true;
    } catch (e: any) {
        return false;
    }
}

export function checkThatNpmCanReadCwd() {
    const cwd = process.cwd();
    let childOutput = null;
    try {
        // Note: intentionally using spawn over exec since
        // the problem doesn't reproduce otherwise.
        // `npm config list` is the only reliable way I could find
        // to reproduce the wrong path. Just printing process.cwd()
        // in a Node process was not enough.
        childOutput = spawn.sync('npm', ['config', 'list']).output.join('');
    } catch (err: any) {
        // Something went wrong spawning node.
        // Not great, but it means we can't do this check.
        // We might fail later on, but let's continue.
        return true;
    }
    if (typeof childOutput !== 'string') {
        return true;
    }
    const lines = childOutput.split('\n');
    // `npm config list` output includes the following line:
    // "; cwd = C:\path\to\current\dir" (unquoted)
    // I couldn't find an easier way to get it.
    const prefix = '; cwd = ';
    const line = lines.find(l => l.indexOf(prefix) === 0);
    if (typeof line !== 'string') {
        // Fail gracefully. They could remove it.
        return true;
    }
    const npmCWD = line.substring(prefix.length);
    if (npmCWD === cwd) {
        return true;
    }
    log(
        pc.red(
            'Could not start an npm process in the right directory.\n\n' +
                `The current directory is: ${pc.bold(cwd)}\n` +
                `However, a newly started npm process runs in: ${pc.bold(npmCWD)}\n\n` +
                'This is probably caused by a misconfigured system terminal shell.',
        ),
    );
    if (process.platform === 'win32') {
        log(
            pc.red('On Windows, this can usually be fixed by running:\n\n') +
                `  ${pc.cyan('reg')} delete "HKCU\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n` +
                `  ${pc.cyan(
                    'reg',
                )} delete "HKLM\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n\n` +
                pc.red('Try to run the above two lines in the terminal.\n') +
                pc.red(
                    'To learn more about this problem, read: https://blogs.msdn.microsoft.com/oldnewthing/20071121-00/?p=24433/',
                ),
        );
    }
    return false;
}

/**
 * Install packages via npm.
 * Based on the install function from https://github.com/facebook/create-react-app
 */
export function installPackages(options: {
    dependencies: string[];
    isDevDependencies?: boolean;
    logLevel: CliLogLevel;
}): Promise<void> {
    const { dependencies, isDevDependencies = false, logLevel } = options;
    return new Promise((resolve, reject) => {
        const command = 'npm';
        const args = ['install', '--save', '--save-exact', '--loglevel', 'error'].concat(dependencies);
        if (isDevDependencies) {
            args.push('--save-dev');
        }

        if (logLevel === 'verbose') {
            args.push('--verbose');
        }

        const child = spawn(command, args, { stdio: logLevel === 'verbose' ? 'inherit' : 'ignore' });
        child.on('close', code => {
            if (code !== 0) {
                let message = 'An error occurred when installing dependencies.';
                if (logLevel === 'silent') {
                    message += ' Try running with `--log-level verbose` to diagnose.';
                }
                reject({
                    message,
                    command: `${command} ${args.join(' ')}`,
                });
                return;
            }
            resolve();
        });
    });
}

export function getDependencies(
    dbType: DbType,
    vendurePkgVersion = '',
): { dependencies: string[]; devDependencies: string[] } {
    const dependencies = [
        `@vendure/core${vendurePkgVersion}`,
        `@vendure/email-plugin${vendurePkgVersion}`,
        `@vendure/asset-server-plugin${vendurePkgVersion}`,
        `@vendure/admin-ui-plugin${vendurePkgVersion}`,
        'dotenv',
        dbDriverPackage(dbType),
    ];
    const devDependencies = [
        `@vendure/cli${vendurePkgVersion}`,
        'concurrently',
        `typescript@${TYPESCRIPT_VERSION}`,
    ];
    return { dependencies, devDependencies };
}

/**
 * Returns the name of the npm driver package for the
 * selected database.
 */
function dbDriverPackage(dbType: DbType): string {
    switch (dbType) {
        case 'mysql':
        case 'mariadb':
            return 'mysql';
        case 'postgres':
            return 'pg';
        case 'sqlite':
            return 'better-sqlite3';
        default:
            const n: never = dbType;
            log(pc.red(`No driver package configured for type "${dbType as string}"`));
            return '';
    }
}

/**
 * Checks that the specified DB connection options are working (i.e. a connection can be
 * established) and that the named database exists.
 */
export function checkDbConnection(options: any, root: string): Promise<true> {
    switch (options.type) {
        case 'mysql':
            return checkMysqlDbExists(options, root);
        case 'postgres':
            return checkPostgresDbExists(options, root);
        default:
            return Promise.resolve(true);
    }
}

async function checkMysqlDbExists(options: any, root: string): Promise<true> {
    const mysql = await import(path.join(root, 'node_modules/mysql'));
    const connectionOptions = {
        host: options.host,
        user: options.username,
        password: options.password,
        port: options.port,
        database: options.database,
    };
    const connection = mysql.createConnection(connectionOptions);

    return new Promise<boolean>((resolve, reject) => {
        connection.connect((err: any) => {
            if (err) {
                if (err.code === 'ER_BAD_DB_ERROR') {
                    throwDatabaseDoesNotExist(options.database);
                }
                throwConnectionError(err);
            }
            resolve(true);
        });
    }).then(() => {
        return new Promise((resolve, reject) => {
            connection.end((err: any) => {
                resolve(true);
            });
        });
    });
}

async function checkPostgresDbExists(options: any, root: string): Promise<true> {
    const { Client } = await import(path.join(root, 'node_modules/pg'));
    const connectionOptions = {
        host: options.host,
        user: options.username,
        password: options.password,
        port: options.port,
        database: options.database,
        schema: options.schema,
        ssl: options.ssl,
    };
    const client = new Client(connectionOptions);

    try {
        await client.connect();

        const schema = await client.query(
            `SELECT schema_name FROM information_schema.schemata WHERE schema_name = '${
                options.schema as string
            }'`,
        );
        if (schema.rows.length === 0) {
            throw new Error('NO_SCHEMA');
        }
    } catch (e: any) {
        if (e.code === '3D000') {
            throwDatabaseDoesNotExist(options.database);
        } else if (e.message === 'NO_SCHEMA') {
            throwDatabaseSchemaDoesNotExist(options.database, options.schema);
        } else if (e.code === '28000') {
            throwSSLConnectionError(e, options.ssl);
        }
        throwConnectionError(e);
        await client.end();
        throw e;
    }
    await client.end();
    return true;
}

/**
 * Check to see if Docker is installed and running.
 * If not, attempt to start it.
 * If that is not possible, return false.
 *
 * Refs:
 * - https://stackoverflow.com/a/48843074/772859
 */
export async function isDockerAvailable(): Promise<{ result: 'not-found' | 'not-running' | 'running' }> {
    const dockerSpinner = spinner();

    function isDaemonRunning(): boolean {
        try {
            execFileSync('docker', ['stats', '--no-stream'], { stdio: 'ignore' });
            return true;
        } catch (e: any) {
            return false;
        }
    }

    dockerSpinner.start('Checking for Docker');
    try {
        execFileSync('docker', ['-v'], { stdio: 'ignore' });
        dockerSpinner.message('Docker was found!');
    } catch (e: any) {
        dockerSpinner.stop('Docker was not found on this machine. We will use SQLite for the database.');
        return { result: 'not-found' };
    }
    // Now we need to check if the docker daemon is running
    const isRunning = isDaemonRunning();
    if (isRunning) {
        dockerSpinner.stop('Docker is running');
        return { result: 'running' };
    }
    dockerSpinner.message('Docker daemon is not running. Attempting to start');
    // detect the current OS
    const currentPlatform = platform();
    try {
        if (currentPlatform === 'win32') {
            // https://stackoverflow.com/a/44182489/772859
            execSync('"C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe"', { stdio: 'ignore' });
        } else if (currentPlatform === 'darwin') {
            execSync('open -a Docker', { stdio: 'ignore' });
        } else {
            execSync('systemctl start docker', { stdio: 'ignore' });
        }
    } catch (e: any) {
        dockerSpinner.stop('Could not start Docker.');
        log(e.message, { level: 'verbose' });
        return { result: 'not-running' };
    }
    // Verify that the daemon is now running
    let attempts = 1;
    do {
        log(`Checking for Docker daemon... (attempt ${attempts})`, { level: 'verbose' });
        if (isDaemonRunning()) {
            log(`Docker daemon is now running (after ${attempts} attempts).`, { level: 'verbose' });
            dockerSpinner.stop('Docker is running');
            return { result: 'running' };
        }
        await new Promise(resolve => setTimeout(resolve, 50));
        attempts++;
    } while (attempts < 100);
    dockerSpinner.stop('Docker daemon could not be started');
    return { result: 'not-running' };
}

export async function startPostgresDatabase(root: string): Promise<boolean> {
    // Now we need to run the postgres database via Docker
    let containerName: string | undefined;
    const postgresContainerSpinner = spinner();
    postgresContainerSpinner.start('Starting PostgreSQL database');
    try {
        const result = await promisify(execFile)(`docker`, [
            `compose`,
            `-f`,
            path.join(root, 'docker-compose.yml'),
            `up`,
            `-d`,
            `postgres_db`,
        ]);
        containerName = result.stderr.match(/Container\s+(.+-postgres_db[^ ]*)/)?.[1];
        if (!containerName) {
            // guess the container name based on the directory name
            containerName = path.basename(root).replace(/[^a-z0-9]/gi, '') + '-postgres_db-1';
            postgresContainerSpinner.message(
                'Could not find container name. Guessing it is: ' + containerName,
            );
            log(pc.red('Could not find container name. Guessing it is: ' + containerName), {
                newline: 'before',
                level: 'verbose',
            });
        } else {
            log(pc.green(`Started PostgreSQL database in container "${containerName}"`), {
                newline: 'before',
                level: 'verbose',
            });
        }
    } catch (e: any) {
        log(pc.red(`Failed to start PostgreSQL database: ${e.message as string}`));
        postgresContainerSpinner.stop('Failed to start PostgreSQL database');
        return false;
    }
    postgresContainerSpinner.message(`Waiting for PostgreSQL database to be ready...`);
    let attempts = 1;
    let isReady = false;
    do {
        // We now need to ensure that the database is ready to accept connections
        try {
            const result = execFileSync(`docker`, [`exec`, `-i`, containerName, `pg_isready`]);
            isReady = result?.toString().includes('accepting connections');
            if (!isReady) {
                log(pc.yellow(`PostgreSQL database not yet ready. Attempt ${attempts}...`), {
                    level: 'verbose',
                });
            }
        } catch (e: any) {
            // ignore
            log('is_ready error:' + (e.message as string), { level: 'verbose', newline: 'before' });
        }
        await new Promise(resolve => setTimeout(resolve, 50));
        attempts++;
    } while (!isReady && attempts < 100);
    postgresContainerSpinner.stop('PostgreSQL database is ready');
    return true;
}

function throwConnectionError(err: any) {
    throw new Error(
        'Could not connect to the database. ' +
            `Please check the connection settings in your Vendure config.\n[${
                (err.message || err.toString()) as string
            }]`,
    );
}

function throwSSLConnectionError(err: any, sslEnabled?: any) {
    throw new Error(
        'Could not connect to the database. ' +
            (sslEnabled === undefined
                ? 'Is your server requiring an SSL connection?'
                : 'Are you sure your server supports SSL?') +
            `Please check the connection settings in your Vendure config.\n[${
                (err.message || err.toString()) as string
            }]`,
    );
}

function throwDatabaseDoesNotExist(name: string) {
    throw new Error(`Database "${name}" does not exist. Please create the database and then try again.`);
}

function throwDatabaseSchemaDoesNotExist(dbName: string, schemaName: string) {
    throw new Error(
        `Schema "${dbName}.${schemaName}" does not exist. Please create the schema "${schemaName}" and then try again.`,
    );
}

export function isServerPortInUse(port: number): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const tcpPortUsed = require('tcp-port-used');
    try {
        return tcpPortUsed.check(port);
    } catch (e: any) {
        log(pc.yellow(`Warning: could not determine whether port ${port} is available`));
        return Promise.resolve(false);
    }
}

/**
 * Checks if the response from a Clack prompt was a cancellation symbol, and if so,
 * ends the interactive process.
 */
export function checkCancel<T>(value: T | symbol): value is T {
    if (isCancel(value)) {
        cancel('Setup cancelled.');
        process.exit(0);
    }
    return true;
}

export function cleanUpDockerResources(name: string) {
    try {
        execSync(`docker stop $(docker ps -a -q --filter "label=io.vendure.create.name=${name}")`, {
            stdio: 'ignore',
        });
        execSync(`docker rm $(docker ps -a -q --filter "label=io.vendure.create.name=${name}")`, {
            stdio: 'ignore',
        });
        execSync(`docker volume rm $(docker volume ls --filter "label=io.vendure.create.name=${name}" -q)`, {
            stdio: 'ignore',
        });
    } catch (e) {
        log(pc.yellow(`Could not clean up Docker resources`), { level: 'verbose' });
    }
}
