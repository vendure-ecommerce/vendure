import fs from 'fs-extra';
import path from 'path';

import { addStream } from './add-stream';
// tslint:disable-next-line:no-var-requires
const conventionalChangelogCore = require('conventional-changelog-core');

if (process.env.SKIP_CHANGELOG || process.env.npm_config_argv?.includes('publish-prerelease')) {
    // tslint:disable-next-line:no-console
    console.log(`Skipping changelog generation for pre-release`);
    process.exit(0);
}

/**
 * The types of commit which will be included in the changelog.
 */
const VALID_TYPES = ['feat', 'fix', 'perf'];

/**
 * Define which packages to create changelog entries for.
 */
const VALID_SCOPES: string[] = [
    'admin-ui-plugin',
    'admin-ui',
    'asset-server',
    'asset-server-plugin',
    'common',
    'core',
    'create',
    'elasticsearch-plugin',
    'email-plugin',
    'email',
    'job-queue-plugin',
    'testing',
    'ui-devkit',
];

const mainTemplate = fs.readFileSync(path.join(__dirname, 'template.hbs'), 'utf-8');
const commitTemplate = fs.readFileSync(path.join(__dirname, 'commit.hbs'), 'utf-8');

generateChangelogForPackage();

/**
 * Generates changelog entries based on the conventional commits data.
 */
function generateChangelogForPackage() {
    const changelogPath = path.join(__dirname, '../../CHANGELOG.md');
    const inStream = fs.createReadStream(changelogPath, { flags: 'a+' });
    const tempFile = path.join(__dirname, `__temp_changelog__`);
    conventionalChangelogCore(
        {
            transform: (commit: any, context: any) => {
                const includeCommit = VALID_TYPES.includes(commit.type) && scopeIsValid(commit.scope);
                if (includeCommit) {
                    return context(null, commit);
                } else {
                    return context(null, null);
                }
            },
            releaseCount: 1,
            outputUnreleased: true,
        },
        {
            version: require('../../lerna.json').version,
        },
        null,
        null,
        {
            mainTemplate,
            commitPartial: commitTemplate,
            finalizeContext(context: any, options: any, commits: any) {
                context.commitGroups.forEach(addHeaderToCommitGroup);
                return context;
            },
        },
    )
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

function scopeIsValid(scope?: string): boolean {
    for (const validScope of VALID_SCOPES) {
        if (scope && scope.includes(validScope)) {
            return true;
        }
    }
    return false;
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
