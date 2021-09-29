const path = require('path');
const { getPackageDir } = require('./get-package-dir');

const packageDirname = getPackageDir();

module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: packageDirname,
    testRegex: '.e2e-spec.ts$',
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
