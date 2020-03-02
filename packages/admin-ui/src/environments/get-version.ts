export function getVersion(): string {
    let version: string | undefined;
    try {
        version = require('../../../core/package.json').version;
    } catch (e) {
        /**/
    }
    if (!version) {
        try {
            version = require('../../../../core/package.json').version;
        } catch (e) {
            /**/
        }
    }
    return version || 'unknown';
}
