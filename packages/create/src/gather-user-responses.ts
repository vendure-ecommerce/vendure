import { SUPER_ADMIN_USER_IDENTIFIER, SUPER_ADMIN_USER_PASSWORD } from '@vendure/common/lib/shared-constants';
import fs from 'fs-extra';
import Handlebars from 'handlebars';
import path from 'path';
import prompts, { PromptObject } from 'prompts';

import { DbType, UserResponses } from './types';

// tslint:disable:no-console

/**
 * Prompts the user to determine how the new Vendure app should be configured.
 */
export async function gatherUserResponses(root: string): Promise<UserResponses> {
    function onSubmit(prompt: PromptObject, answer: any) {
        if (prompt.name === 'dbType') {
            dbType = answer;
        }
    }

    let dbType: DbType;

    const answers = await prompts(
        [
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
                type: 'select',
                name: 'language',
                message: 'Which programming language will you be using?',
                choices: [
                    { title: 'TypeScript', value: 'ts' },
                    { title: 'JavaScript', value: 'js' },
                ],
                initial: 0 as any,
            },
            {
                type: 'toggle',
                name: 'populateProducts',
                message: 'Populate with some sample product data?',
                initial: true,
                active: 'yes',
                inactive: 'no',
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
        ],
        {
            onSubmit,
            onCancel() {
                /* */
            },
        },
    );

    if (!answers.language) {
        console.log('Setup aborted. No changes made');
        process.exit(0);
    }

    const { indexSource, indexWorkerSource, configSource, migrationSource, readmeSource } =
        await generateSources(root, answers);
    return {
        indexSource,
        indexWorkerSource,
        configSource,
        migrationSource,
        readmeSource,
        usingTs: answers.language === 'ts',
        dbType: answers.dbType,
        populateProducts: answers.populateProducts,
        superadminIdentifier: answers.superadminIdentifier,
        superadminPassword: answers.superadminPassword,
    };
}

/**
 * Returns mock "user response" without prompting, for use in CI
 */
export async function gatherCiUserResponses(root: string): Promise<UserResponses> {
    const ciAnswers = {
        dbType: 'sqlite' as const,
        dbHost: '',
        dbPort: '',
        dbName: 'vendure',
        dbUserName: '',
        dbPassword: '',
        language: 'ts',
        populateProducts: true,
        superadminIdentifier: SUPER_ADMIN_USER_IDENTIFIER,
        superadminPassword: SUPER_ADMIN_USER_PASSWORD,
    };
    const { indexSource, indexWorkerSource, configSource, migrationSource, readmeSource } =
        await generateSources(root, ciAnswers);
    return {
        indexSource,
        indexWorkerSource,
        configSource,
        migrationSource,
        readmeSource,
        usingTs: ciAnswers.language === 'ts',
        dbType: ciAnswers.dbType,
        populateProducts: ciAnswers.populateProducts,
        superadminIdentifier: ciAnswers.superadminIdentifier,
        superadminPassword: ciAnswers.superadminPassword,
    };
}

/**
 * Create the server index, worker and config source code based on the options specified by the CLI prompts.
 */
async function generateSources(
    root: string,
    answers: any,
): Promise<{
    indexSource: string;
    indexWorkerSource: string;
    configSource: string;
    migrationSource: string;
    readmeSource: string;
}> {
    const assetPath = (fileName: string) => path.join(__dirname, '../assets', fileName);

    /**
     * Helper to escape single quotes only. Used when generating the config file since e.g. passwords
     * might use special chars (`< > ' "` etc) which Handlebars would be default convert to HTML entities.
     * Instead, we disable escaping and use this custom helper to escape only the single quote character.
     */
    Handlebars.registerHelper('escapeSingle', (aString: unknown) => {
        return typeof aString === 'string' ? aString.replace(`'`, `\\'`) : aString;
    });

    const templateContext = {
        ...answers,
        dbType: answers.dbType === 'sqlite' ? 'better-sqlite3' : answers.dbType,
        name: path.basename(root),
        isTs: answers.language === 'ts',
        isSQLite: answers.dbType === 'sqlite',
        isSQLjs: answers.dbType === 'sqljs',
        requiresConnection: answers.dbType !== 'sqlite' && answers.dbType !== 'sqljs',
    };
    const configTemplate = await fs.readFile(assetPath('vendure-config.hbs'), 'utf-8');
    const configSource = Handlebars.compile(configTemplate, { noEscape: true })(templateContext);
    const indexTemplate = await fs.readFile(assetPath('index.hbs'), 'utf-8');
    const indexSource = Handlebars.compile(indexTemplate)(templateContext);
    const indexWorkerTemplate = await fs.readFile(assetPath('index-worker.hbs'), 'utf-8');
    const indexWorkerSource = Handlebars.compile(indexWorkerTemplate)(templateContext);
    const migrationTemplate = await fs.readFile(assetPath('migration.hbs'), 'utf-8');
    const migrationSource = Handlebars.compile(migrationTemplate)(templateContext);
    const readmeTemplate = await fs.readFile(assetPath('readme.hbs'), 'utf-8');
    const readmeSource = Handlebars.compile(readmeTemplate)(templateContext);
    return { indexSource, indexWorkerSource, configSource, migrationSource, readmeSource };
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
