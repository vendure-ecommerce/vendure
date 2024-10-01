const path = require('path');

/**
 * @return {string}
 */
function getPackageDir() {
    // Useful for launch scripts that debug specific test files. See the launch.json file in the .vscode folder.
    const testFile = process.env.TEST_FILE || process.argv.find(arg => arg.startsWith('--package='));
    if (testFile) {
        const testFilePath = testFile.split('=')[1] ?? testFile;
        return path.dirname(testFilePath);
    }

    const packageArg = process.env.PACKAGE || process.argv.find(arg => arg.startsWith('--package='));
    if (!packageArg) {
        console.error('No package specified! Please pass --package=<packageDirName>');
        process.exit(1);
    }
    const packageDirname = packageArg.split('=')[1];
    return path.join(__dirname, '../packages', packageDirname ?? packageArg, 'e2e');
}

module.exports = { getPackageDir };
