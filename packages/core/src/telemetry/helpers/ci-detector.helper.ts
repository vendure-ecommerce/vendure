/**
 * CI environment variables to check for.
 * These are standard environment variables set by popular CI/CD systems.
 * Exported for testing purposes.
 */
export const CI_ENV_VARS = [
    'CI',
    'GITHUB_ACTIONS',
    'GITLAB_CI',
    'CIRCLECI',
    'TRAVIS',
    'JENKINS_URL',
    'BUILDKITE',
    'DRONE',
    'TEAMCITY_VERSION',
    'BITBUCKET_BUILD_NUMBER',
    'TF_BUILD',
    'CODEBUILD_BUILD_ID',
    'HEROKU_TEST_RUN_ID',
    'APPVEYOR',
    'NETLIFY',
    'VERCEL',
    'NOW_BUILDER',
];

/**
 * Detects if the current process is running in a CI/CD environment.
 * Returns true if any known CI environment variable is set.
 */
export function isCI(): boolean {
    return CI_ENV_VARS.some(envVar => {
        const value = process.env[envVar];
        return value !== undefined && value !== '' && value !== 'false' && value !== '0';
    });
}
