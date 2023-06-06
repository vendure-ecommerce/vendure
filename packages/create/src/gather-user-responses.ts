import { cancel, intro, isCancel, outro, select, text } from '@clack/prompts';
import { SUPER_ADMIN_USER_IDENTIFIER, SUPER_ADMIN_USER_PASSWORD } from '@vendure/common/lib/shared-constants';
import fs from 'fs-extra';
import Handlebars from 'handlebars';
import path from 'path';

import { DbType, FileSources, UserResponses } from './types';

interface PromptAnswers {
    dbType: DbType;
    dbHost: string | symbol;
    dbPort: string | symbol;
    dbName: string | symbol;
    dbSchema?: string | symbol;
    dbUserName: string | symbol;
    dbPassword: string | symbol;
    superadminIdentifier: string | symbol;
    superadminPassword: string | symbol;
    populateProducts: boolean | symbol;
}

/* eslint-disable no-console */

/**
 * Prompts the user to determine how the new Vendure app should be configured.
 */
export async function gatherUserResponses(
    root: string,
    alreadyRanScaffold: boolean,
    useYarn: boolean,
): Promise<UserResponses> {
    const dbType = (await select({
        message: 'Which database are you using?',
        options: [
            { label: 'MySQL', value: 'mysql' },
            { label: 'MariaDB', value: 'mariadb' },
            { label: 'Postgres', value: 'postgres' },
            { label: 'SQLite', value: 'sqlite' },
            { label: 'SQL.js', value: 'sqljs' },
        ],
        initialValue: 'sqlite' as DbType,
    })) as DbType;
    checkCancel(dbType);

    const hasConnection = dbType !== 'sqlite' && dbType !== 'sqljs';
    const dbHost = hasConnection
        ? await text({
              message: "What's the database host address?",
              initialValue: 'localhost',
          })
        : '';
    checkCancel(dbHost);
    const dbPort = hasConnection
        ? await text({
              message: 'What port is the database listening on?',
              initialValue: defaultDBPort(dbType).toString(),
          })
        : '';
    checkCancel(dbPort);
    const dbName = hasConnection
        ? await text({
              message: "What's the name of the database?",
              initialValue: 'vendure',
          })
        : '';
    checkCancel(dbName);
    const dbSchema =
        dbType === 'postgres'
            ? await text({
                  message: "What's the schema name we should use?",
                  initialValue: 'public',
              })
            : '';
    checkCancel(dbSchema);
    const dbUserName = hasConnection
        ? await text({
              message: "What's the database user name?",
          })
        : '';
    checkCancel(dbUserName);
    const dbPassword = hasConnection
        ? await text({
              message: "What's the database password?",
              defaultValue: '',
          })
        : '';
    checkCancel(dbPassword);
    const superadminIdentifier = await text({
        message: 'What identifier do you want to use for the superadmin user?',
        initialValue: SUPER_ADMIN_USER_IDENTIFIER,
    });
    checkCancel(superadminIdentifier);
    const superadminPassword = await text({
        message: 'What password do you want to use for the superadmin user?',
        initialValue: SUPER_ADMIN_USER_PASSWORD,
    });
    checkCancel(superadminPassword);
    const populateProducts = await select({
        message: 'Populate with some sample product data?',
        options: [
            { label: 'yes', value: true },
            { label: 'no', value: false },
        ],
        initialValue: true,
    });
    checkCancel(populateProducts);

    const answers: PromptAnswers = {
        dbType,
        dbHost,
        dbPort,
        dbName,
        dbSchema,
        dbUserName,
        dbPassword,
        superadminIdentifier,
        superadminPassword,
        populateProducts,
    };

    return {
        ...(await generateSources(root, answers, useYarn)),
        dbType,
        populateProducts: answers.populateProducts as boolean,
        superadminIdentifier: answers.superadminIdentifier as string,
        superadminPassword: answers.superadminPassword as string,
    };
}

/**
 * Returns mock "user response" without prompting, for use in CI
 */
export async function gatherCiUserResponses(root: string, useYarn: boolean): Promise<UserResponses> {
    const ciAnswers = {
        dbType: 'sqlite' as const,
        dbHost: '',
        dbPort: '',
        dbName: 'vendure',
        dbUserName: '',
        dbPassword: '',
        populateProducts: true,
        superadminIdentifier: SUPER_ADMIN_USER_IDENTIFIER,
        superadminPassword: SUPER_ADMIN_USER_PASSWORD,
    };

    return {
        ...(await generateSources(root, ciAnswers, useYarn)),
        dbType: ciAnswers.dbType,
        populateProducts: ciAnswers.populateProducts,
        superadminIdentifier: ciAnswers.superadminIdentifier,
        superadminPassword: ciAnswers.superadminPassword,
    };
}

function checkCancel<T>(value: T | symbol): value is T {
    if (isCancel(value)) {
        cancel('Setup cancelled.');
        process.exit(0);
    }
    return true;
}

/**
 * Create the server index, worker and config source code based on the options specified by the CLI prompts.
 */
async function generateSources(root: string, answers: PromptAnswers, useYarn: boolean): Promise<FileSources> {
    const assetPath = (fileName: string) => path.join(__dirname, '../assets', fileName);

    /**
     * Helper to escape single quotes only. Used when generating the config file since e.g. passwords
     * might use special chars (`< > ' "` etc) which Handlebars would be default convert to HTML entities.
     * Instead, we disable escaping and use this custom helper to escape only the single quote character.
     */
    Handlebars.registerHelper('escapeSingle', (aString: unknown) => {
        return typeof aString === 'string' ? aString.replace(/'/g, "\\'") : aString;
    });

    const templateContext = {
        ...answers,
        useYarn,
        dbType: answers.dbType === 'sqlite' ? 'better-sqlite3' : answers.dbType,
        name: path.basename(root),
        isSQLite: answers.dbType === 'sqlite',
        isSQLjs: answers.dbType === 'sqljs',
        requiresConnection: answers.dbType !== 'sqlite' && answers.dbType !== 'sqljs',
        cookieSecret: Math.random().toString(36).substr(2),
    };

    async function createSourceFile(filename: string, noEscape = false): Promise<string> {
        const template = await fs.readFile(assetPath(filename), 'utf-8');
        return Handlebars.compile(template, { noEscape })(templateContext);
    }

    return {
        indexSource: await createSourceFile('index.hbs'),
        indexWorkerSource: await createSourceFile('index-worker.hbs'),
        configSource: await createSourceFile('vendure-config.hbs', true),
        envSource: await createSourceFile('.env.hbs', true),
        envDtsSource: await createSourceFile('environment.d.hbs', true),
        migrationSource: await createSourceFile('migration.hbs'),
        readmeSource: await createSourceFile('readme.hbs'),
        dockerfileSource: await createSourceFile('Dockerfile.hbs'),
        dockerComposeSource: await createSourceFile('docker-compose.hbs'),
    };
}

function defaultDBPort(dbType: DbType): number {
    switch (dbType) {
        case 'mysql':
        case 'mariadb':
            return 3306;
        case 'postgres':
            return 5432;
        case 'mssql':
            return 1433;
        case 'oracle':
            return 1521;
        default:
            return 3306;
    }
}
