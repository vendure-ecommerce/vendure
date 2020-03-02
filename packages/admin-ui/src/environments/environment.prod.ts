import { getVersion } from './get-version';

declare function require(path: string): any;
export const environment = {
    production: true,
    version: getVersion(),
};
