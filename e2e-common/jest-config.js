const path = require('path');
const { getPackageDir } = require('./get-package-dir');

const packageArg = process.argv.find(arg => arg.startsWith('--package='));
// We transfer the CLI argument to the env vars because when Jest runs concurrently,
// it spawns child processes and the argv array data gets lost, but env vars will persist
// between the processes.
process.env.packageArg = packageArg;
const packageDirname = getPackageDir();

module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: packageDirname,
    testRegex: '.e2e-spec.ts$',
    maxWorkers: process.env.CI ? 1 : 3,
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testEnvironment: 'node',
    reporters: ['default', path.join(__dirname, 'custom-reporter.js')],
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/config/tsconfig.e2e.json',
            diagnostics: false,
            isolatedModules: true,
        },
    },
};
