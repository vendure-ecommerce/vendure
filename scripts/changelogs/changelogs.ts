import fs from 'fs-extra';
import path from 'path';

import { addStream } from './add-stream';
// tslint:disable-next-line:no-var-requires
const conventionalChangelogCore = require('conventional-changelog-core');

type PackageDef = { name: string | string[]; path: string; };

/**
 * The types of commit which will be included in the changelog.
 */
const TYPES_TO_INCLUDE = ['feat', 'fix'];

/**
 * Define which packages to create changelog entries for. The `name` property should correspond to the
 * "scope" as used in the commit message.
 */
const PACKAGES: PackageDef[] = [
    { name: ['admin-ui-plugin', 'admin-ui'], path: path.join(__dirname, '../../packages/admin-ui-plugin') },
    { name: ['asset-server', 'asset-server-plugin'], path: path.join(__dirname, '../../packages/asset-server-plugin') },
    { name: 'common', path: path.join(__dirname, '../../packages/common') },
    { name: 'core', path: path.join(__dirname, '../../packages/core') },
    { name: 'create', path: path.join(__dirname, '../../packages/create') },
    { name: ['email-plugin', 'email'], path: path.join(__dirname, '../../packages/email-plugin') },
];

const mainTemplate = fs.readFileSync(path.join(__dirname, 'template.hbs'), 'utf-8');
const commitTemplate = fs.readFileSync(path.join(__dirname, 'commit.hbs'), 'utf-8');

PACKAGES.forEach(generateChangelogForPackage);

/**
 * Generates changelog entries for the given package based on the conventional commits data.
 */
function generateChangelogForPackage(pkg: PackageDef) {
    const changelogPath = path.join(pkg.path, 'CHANGELOG.md');
    const inStream = fs.createReadStream(changelogPath, { flags: 'a+' });
    const tempFile = path.join(__dirname, `__temp_${pkg.name}__`);
    conventionalChangelogCore({
            pkg: {
                path: path.join(pkg.path, 'package.json'),
            },
            transform: (commit: any, context: any) => {
                const includeCommit = scopeMatchesName(commit.scope, pkg.name) && TYPES_TO_INCLUDE.includes(commit.type);
                if (includeCommit) {
                    return context(null, commit);
                } else {
                    return context(null, null);
                }

            },
            releaseCount: 1,
            outputUnreleased: false,
        },
        null,
        null,
        null,
        {
            mainTemplate,
            commitPartial: commitTemplate,
            finalizeContext(context: any, options: any, commits: any) {
                context.commitGroups.forEach(addHeaderToCommitGroup);
                return context;
            },
        })
        .pipe(addStream(inStream))
        .pipe(fs.createWriteStream(tempFile))
        .on('finish', () => {
            fs.createReadStream(tempFile)
                .pipe(fs.createWriteStream(changelogPath))
                .on('finish', () => {
                    fs.unlinkSync(tempFile);
                });
        });
}

function scopeMatchesName(scope: string, name: string | string[]): boolean {
    return Array.isArray(name) ? name.includes(scope) : scope === name;
}

/**
 * The `header` is a more human-readable version of the commit type, as used in the
 * template.hbs as a sub-heading.
 */
function addHeaderToCommitGroup(commitGroup: any) {
    switch (commitGroup.title) {
        case 'fix':
            commitGroup.header = 'Fixes';
            break;
        case 'feat':
            commitGroup.header = 'Features';
            break;
        default:
            commitGroup.header = commitGroup.title.charAt(0).toUpperCase() + commitGroup.title.slice(1);
            break;
    }
}
