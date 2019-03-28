module.exports = {
    coverageDirectory: "coverage",
    moduleFileExtensions: [
        "js",
        "json",
        "ts",
    ],
    moduleNameMapper: {
        "shared/(.*)": "<rootDir>/../../shared/$1.ts",
    },
    preset: "ts-jest",
    rootDir: __dirname,
    roots: [
        "<rootDir>/src",
        "<rootDir>/../../shared",
        "<rootDir>../../mock-data",
    ],
    transform: {
        "^.+\\.(t|j)s$": "ts-jest",
    },
};
