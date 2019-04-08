declare function require(path: string): any;
export const environment = {
    production: true,
    version: require('../../../packages/core/package.json').version,
};
