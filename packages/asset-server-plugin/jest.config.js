module.exports = {
    coverageDirectory: "coverage",
    moduleFileExtensions: [
        "js",
        "json",
        "ts",
    ],
    preset: "ts-jest",
    rootDir: __dirname,
    transform: {
        "^.+\\.(t|j)s$": "ts-jest",
    },
};
