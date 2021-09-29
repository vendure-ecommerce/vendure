module.exports = {
    coverageDirectory: 'coverage',
    moduleFileExtensions: ['js', 'json', 'ts'],
    preset: 'ts-jest',
    rootDir: __dirname,
    roots: ['<rootDir>/src', '<rootDir>/mock-data'],
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    globals: {
        'ts-jest': {
            tsconfig: {
                allowJs: true,
            },
        },
    },
    testEnvironment: 'node',
};
