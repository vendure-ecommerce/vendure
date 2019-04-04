import chalk from 'chalk';
import fs from 'fs-extra';
import Handlebars from 'handlebars';
import path from 'path';
import { PromptObject } from 'prompts';
import prompts from 'prompts';

// tslint:disable:no-console

export type DbType = 'mysql' | 'postgres' | 'sqlite' | 'sqljs' | 'mssql' | 'oracle';
export interface UserResponses {
    usingTs: boolean;
    dbType: DbType;
    populateProducts: boolean;
    indexSource: string;
    configSource: string;
}

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

    console.log(`Let's get started with a new Vendure server!\n`);

    const answers = await prompts(
        [
            {
                type: 'select',
                name: 'dbType',
                message: 'Which database are you using?',
                choices: [
                    { title: 'MySQL / MariaDB', value: 'mysql' },
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
                initial: '192.168.99.100',
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
                choices: [{ title: 'TypeScript', value: 'ts' }, { title: 'JavaScript', value: 'js' }],
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

    const { indexSource, configSource } = await generateSources(root, answers);
    return {
        indexSource,
        configSource,
        usingTs: answers.language === 'ts',
        dbType: answers.dbType,
        populateProducts: answers.populateProducts,
    };
}

/**
 * Create the server index and config source code based on the options specified by the CLI prompts.
 */
async function generateSources(root: string, answers: any): Promise<{ indexSource: string; configSource: string; }> {
    const assetPath = (fileName: string) => path.join(__dirname, '../assets', fileName);

    const templateContext = {
        ...answers,
        isTs: answers.language === 'ts',
        isSQLite: answers.dbType === 'sqlite',
        isSQLjs: answers.dbType === 'sqljs',
        requiresConnection: answers.dbType !== 'sqlite' && answers.dbType !== 'sqljs',
        sessionSecret: Math.random()
            .toString(36)
            .substr(3),
    };
    const configTemplate = await fs.readFile(assetPath('vendure-config.hbs'), 'utf-8');
    const configSource = Handlebars.compile(configTemplate)(templateContext);
    const indexTemplate = await fs.readFile(assetPath('index.hbs'), 'utf-8');
    const indexSource = Handlebars.compile(indexTemplate)(templateContext);
    return { indexSource, configSource };
}

function defaultDBPort(dbType: DbType): number {
    switch (dbType) {
        case 'mysql':
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
