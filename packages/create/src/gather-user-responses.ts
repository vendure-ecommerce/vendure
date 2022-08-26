import { SUPER_ADMIN_USER_IDENTIFIER, SUPER_ADMIN_USER_PASSWORD } from '@vendure/common/lib/shared-constants';
import fs from 'fs-extra';
import Handlebars from 'handlebars';
import path from 'path';
import prompts, { PromptObject } from 'prompts';

import { DbType, FileSources, UserResponses } from './types';

// tslint:disable:no-console

/**
 * Prompts the user to determine how the new Vendure app should be configured.
 */
export async function gatherUserResponses(
    root: string,
    alreadyRanScaffold: boolean,
    useYarn: boolean,
): Promise<UserResponses> {
    function onSubmit(prompt: PromptObject, answer: any) {
        if (prompt.name === 'dbType') {
            dbType = answer;
        }
    }

    let dbType: DbType;

    const scaffoldPrompts: Array<prompts.PromptObject<any>> = [
        {
            type: 'select',
            name: 'dbType',
            message: 'Which database are you using?',
            choices: [
                { title: 'MySQL', value: 'mysql' },
                { title: 'MariaDB', value: 'mariadb' },
                { title: 'Postgres', value: 'postgres' },
                { title: 'SQLite', value: 'sqlite' },
                { title: 'SQL.js', value: 'sqljs' },
                // Don't show these until they have been tested.
                // { title: 'MS SQL Server', value: 'mssql' },
                // { title: 'Oracle', value: 'oracle' },
            ],
            initial: 0 as any,
        },
        {
            type: (() => (dbType === 'sqlite' || dbType === 'sqljs' ? null : 'text')) as any,
            name: 'dbHost',
            message: `What's the database host address?`,
            initial: 'localhost',
        },
        {
            type: (() => (dbType === 'sqlite' || dbType === 'sqljs' ? null : 'text')) as any,
            name: 'dbPort',
            message: `What port is the database listening on?`,
            initial: (() => defaultDBPort(dbType)) as any,
        },
        {
            type: (() => (dbType === 'sqlite' || dbType === 'sqljs' ? null : 'text')) as any,
            name: 'dbName',
            message: `What's the name of the database?`,
            initial: 'vendure',
        },
        {
            type: (() => (dbType === 'postgres' ? 'text' : null)) as any,
            name: 'dbSchema',
            message: `What's the schema name we should use?`,
            initial: 'public',
        },
        {
            type: (() => (dbType === 'sqlite' || dbType === 'sqljs' ? null : 'text')) as any,
            name: 'dbUserName',
            message: `What's the database user name?`,
            initial: 'root',
        },
        {
            type: (() => (dbType === 'sqlite' || dbType === 'sqljs' ? null : 'password')) as any,
            name: 'dbPassword',
            message: `What's the database password?`,
        },
        {
            type: 'text',
            name: 'superadminIdentifier',
            message: 'What identifier do you want to use for the superadmin user?',
            initial: SUPER_ADMIN_USER_IDENTIFIER,
        },
        {
            type: 'text',
            name: 'superadminPassword',
            message: 'What password do you want to use for the superadmin user?',
            initial: SUPER_ADMIN_USER_PASSWORD,
        },
    ];

    const initPrompts: Array<prompts.PromptObject<any>> = [
        {
            type: 'toggle',
            name: 'populateProducts',
            message: 'Populate with some sample product data?',
            initial: true,
            active: 'yes',
            inactive: 'no',
        },
    ];

    const answers = await prompts(alreadyRanScaffold ? initPrompts : [...scaffoldPrompts, ...initPrompts], {
        onSubmit,
        onCancel() {
            /* */
            console.log(`Setup cancelled`);
            process.exit(1);
        },
    });

    return {
        ...(await generateSources(root, answers, useYarn)),
        dbType: answers.dbType,
        populateProducts: answers.populateProducts,
        superadminIdentifier: answers.superadminIdentifier,
        superadminPassword: answers.superadminPassword,
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

/**
 * Create the server index, worker and config source code based on the options specified by the CLI prompts.
 */
async function generateSources(root: string, answers: any, useYarn: boolean): Promise<FileSources> {
    const assetPath = (fileName: string) => path.join(__dirname, '../assets', fileName);

    /**
     * Helper to escape single quotes only. Used when generating the config file since e.g. passwords
     * might use special chars (`< > ' "` etc) which Handlebars would be default convert to HTML entities.
     * Instead, we disable escaping and use this custom helper to escape only the single quote character.
     */
    Handlebars.registerHelper('escapeSingle', (aString: unknown) => {
        return typeof aString === 'string' ? aString.replace(/'/g, `\\'`) : aString;
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
