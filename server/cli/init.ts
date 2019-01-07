import fs from 'fs-extra';
import Handlebars from 'handlebars';
import path from 'path';
import { PromptObject } from 'prompts';
import prompts from 'prompts';

// tslint:disable:no-console
export async function init(): Promise<string> {
    function defaultPort(_dbType: string) {
        switch (_dbType) {
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

    function onSubmit(prompt: PromptObject, answer: any) {
        if (prompt.name === 'dbType') {
            dbType = answer;
        }
    }

    let dbType: string;

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
                    { title: 'MS SQL Server', value: 'mssql' },
                    { title: 'Oracle', value: 'oracle' },
                ],
                initial: 0 as any,
            },
            {
                type: (() => (dbType === 'sqlite' ? null : 'text')) as any,
                name: 'dbHost',
                message: `What's the database host address?`,
                initial: '192.168.99.100',
            },
            {
                type: (() => (dbType === 'sqlite' ? null : 'text')) as any,
                name: 'dbPort',
                message: `What port is the database listening on?`,
                initial: (() => defaultPort(dbType)) as any,
            },
            {
                type: 'text',
                name: 'dbName',
                message: () =>
                    dbType === 'sqlite'
                        ? `What is the path to the SQLite database file?`
                        : `What's the name of the database?`,
                initial: (() =>
                    dbType === 'sqlite' ? path.join(__dirname, 'vendure.sqlite') : 'vendure') as any,
            },
            {
                type: (() => (dbType === 'sqlite' ? null : 'text')) as any,
                name: 'dbUserName',
                message: `What's the database user name?`,
                initial: 'root',
            },
            {
                type: (() => (dbType === 'sqlite' ? null : 'password')) as any,
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

    await createDirectoryStructure();
    await copyEmailTemplates();
    return createFilesForBootstrap(answers);
}

/**
 * Generate the default directory structure for a new Vendure project
 */
async function createDirectoryStructure() {
    const cwd = process.cwd();
    await fs.ensureDir(path.join(cwd, 'vendure', 'email', 'test-emails'));
    await fs.ensureDir(path.join(cwd, 'vendure', 'import-assets'));
    await fs.ensureDir(path.join(cwd, 'vendure', 'assets'));
}

/**
 * Copy the email templates into the app
 */
async function copyEmailTemplates() {
    const templateDir = path.join(__dirname, 'assets', 'email-templates');
    try {
        await fs.copy(templateDir, path.join(process.cwd(), 'vendure', 'email', 'templates'));
    } catch (err) {
        console.error(`Failed to copy email templates.`);
    }
}

/**
 * Create the server index and config files based on the options specified by the CLI prompts.
 */
async function createFilesForBootstrap(answers: any): Promise<string> {
    const cwd = process.cwd();
    const filePath = (fileName: string): string => path.join(cwd, `${fileName}.${answers.language}`);

    const templateContext = {
        ...answers,
        isTs: answers.language === 'ts',
        isSQLite: answers.dbType === 'sqlite',
        sessionSecret: Math.random()
            .toString(36)
            .substr(3),
    };
    const configTemplate = await fs.readFile(path.join(__dirname, 'assets', 'vendure-config.hbs'), 'utf-8');
    const configSource = Handlebars.compile(configTemplate)(templateContext);
    await fs.writeFile(filePath('vendure-config'), configSource);
    const indexTemplate = await fs.readFile(path.join(__dirname, 'assets', 'index.hbs'), 'utf-8');
    const indexSource = Handlebars.compile(indexTemplate)(templateContext);
    await fs.writeFile(filePath('index'), indexSource);

    return filePath('index');
}
