#!/usr/bin/env node

import * as fs from 'fs-extra';
import * as Handlebars from 'handlebars';
import * as path from 'path';
import * as prompts from 'prompts';

// tslint:disable:no-console
console.log(
    '\x1b[36m%s\x1b[0m',
    `
                      _
                     | |
 __   _____ _ __   __| |_   _ _ __ ___
 \\ \\ / / _ \\ '_ \\ / _\` | | | | '__/ _ \\
  \\ V /  __/ | | | (_| | |_| | | |  __/
   \\_/ \\___|_| |_|\\__,_|\\__,_|_|  \\___|


                                       `,
);

console.log(`Let's get started with a new Vendure server!\n`);
prompts([
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
        type: 'text',
        name: 'dbHost',
        message: `What's the database host address?`,
        initial: '192.168.99.100',
    },
    {
        type: 'text',
        name: 'dbName',
        message: `What's the name of the database?`,
        initial: 'vendure',
    },
    {
        type: 'text',
        name: 'dbUserName',
        message: `What's the database user name?`,
        initial: 'root',
    },
    {
        type: 'password',
        name: 'dbPassword',
        message: `What's the database password?`,
    },
    {
        type: 'select',
        name: 'language',
        message: 'Which language will you be using?',
        choices: [{ title: 'TypeScript', value: 'ts' }, { title: 'JavaScript', value: 'js' }],
        initial: 0 as any,
    },
]).then(
    async answers => {
        if (!answers.language) {
            console.log('Setup aborted. No changes made');
            process.exit(0);
        }
        await createDirectoryStructure();
        await copyEmailTemplates();
        await createIndexFile(answers);
        console.log(
            '\x1b[36m%s\x1b[0m',
            `\nAll done! You can now execute the index.${answers.language} file to start the server.`,
        );
    },
    err => console.log('error', err),
);

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
    await fs.copy(templateDir, path.join(process.cwd(), 'vendure', 'email', 'templates'));
}

/**
 * Create the server index file based on the options specified by the CLI prompts.
 */
async function createIndexFile(answers: any) {
    const cwd = process.cwd();

    const templateContext = {
        ...answers,
        isTs: answers.language === 'ts',
        sessionSecret: Math.random()
            .toString(36)
            .substr(3),
    };
    const template = await fs.readFile(path.join(__dirname, 'assets', 'index.hbs'), 'utf-8');
    const indexSource = Handlebars.compile(template)(templateContext);
    await fs.writeFile(path.join(cwd, 'index.' + answers.language), indexSource);
}
