import fs from 'fs-extra';
import path from 'path';

import { addStream } from './add-stream';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const conventionalChangelogCore = require('conventional-changelog-core');

let changelogFileName = 'CHANGELOG.md';
if (process.argv.includes('--next') || process.env.npm_config_argv?.includes('publish-prerelease')) {
    changelogFileName = 'CHANGELOG_NEXT.md';
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
    'cli',
    'common',
    'core',
    'create',
    'dashboard',
    'email-plugin',
    'email',
    'job-queue-plugin',
    'mcp-plugin',
    'mcp-sdk',
    'testing',
    'ui-devkit',
    'harden-plugin',
    'graphiql-plugin',
    'telemetry-plugin',
];

/**
 * The default conventional-commits header pattern, plus `,` in the scope so that commits such as
 * `feat(core,dashboard): ...` are parsed instead of silently dropped.
 */
const HEADER_PATTERN = /^(\w*)(?:\(([\w$.\-*/, ]*)\))?: (.*)$/;

const mainTemplate = fs.readFileSync(path.join(__dirname, 'template.hbs'), 'utf-8');
const commitTemplate = fs.readFileSync(path.join(__dirname, 'commit.hbs'), 'utf-8');

generateChangelogForPackage();

/**
 * Generates changelog entries based on the conventional commits data.
 */
function generateChangelogForPackage() {
    const changelogPath = path.join(__dirname, '../../', changelogFileName);
    const inStream = fs.createReadStream(changelogPath, { flags: 'a+' });
    const tempFile = path.join(__dirname, `__temp_changelog__`);
    conventionalChangelogCore(
        {
            transform: (commit: any, context: any) => {
                restoreDoubleRevert(commit);
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
        { headerPattern: HEADER_PATTERN },
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

/**
 * A `Revert "Revert "<header>""` commit re-applies the original change, but its own header matches
 * no conventional-commit type, so it would be dropped. Treat it as the original commit instead.
 */
function restoreDoubleRevert(commit: any) {
    const originalHeader = commit.revert?.header?.match(/^Revert "(.*)"$/)?.[1];
    const parsed = originalHeader?.match(HEADER_PATTERN);
    if (!parsed) {
        return;
    }
    [, commit.type, commit.scope, commit.subject] = parsed;
    commit.header = originalHeader;
    commit.revert = null;
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
