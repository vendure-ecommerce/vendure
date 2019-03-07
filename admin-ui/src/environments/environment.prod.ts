declare function require(path: string): any;
export const environment = {
    production: true,
    version: require('../../../server/package.json').version,
};
