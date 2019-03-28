// tslint:disable:no-console
/**
 * Logs to the console in a fetching blueish color.
 */
export function logColored(message: string) {
    console.log('\x1b[36m%s\x1b[0m', message);
}
