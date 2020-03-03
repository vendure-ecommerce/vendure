import { ADMIN_UI_VERSION } from './version';

declare function require(path: string): any;
export const environment = {
    production: true,
    version: ADMIN_UI_VERSION,
};
