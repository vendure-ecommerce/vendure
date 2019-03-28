export const E2E_TESTING_ENV_VARIABLE = 'isE2ETest';

export function setTestEnvironment() {
    process.env[E2E_TESTING_ENV_VARIABLE] = '1';
}

export function isTestEnvironment() {
    return !!process.env[E2E_TESTING_ENV_VARIABLE];
}
