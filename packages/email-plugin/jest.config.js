module.exports = {
    coverageDirectory: 'coverage',
    moduleFileExtensions: ['js', 'json', 'ts'],
    preset: 'ts-jest',
    rootDir: __dirname,
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    globals: {
        'ts-jest': {
            isolatedModules: true,
            tsconfig: {
                allowJs: true,
                skipLibCheck: true,
            },
        },
    },
    testEnvironment: 'node',
};
