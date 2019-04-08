/* tslint:disable:no-console */
const fs = require('fs');
const { exec } = require('child_process');

getLastCommitHash()
    .then(hash => writeBuildInfo(hash))
    .then(() => {
        console.log('Updated build info');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

function writeBuildInfo(commitHash) {
    const corePackageJson = require('../packages/core/package');
    const content = {
        version: corePackageJson.version,
        commit: commitHash,
    };
    return new Promise((resolve, reject) => {
        fs.writeFile('./data/build.json', JSON.stringify(content, null, 2), err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

function getLastCommitHash() {
    return new Promise((resolve, reject) => {
        exec(`git log --pretty=format:'%h' -n 1`, (err, out) => {
            if (err) {
                reject(err);
            }
            resolve(out.replace(/'/g, ''));
        });
    });
}
