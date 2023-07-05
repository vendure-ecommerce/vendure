import { exec } from 'child_process';
import fs from 'fs-extra';
import { dest, parallel, series, src, watch as gulpWatch } from 'gulp';
import path from 'path';

const SCHEMAS_GLOB = ['../src/**/*.graphql'];
const MESSAGES_GLOB = ['../src/i18n/messages/**/*'];

function copySchemas() {
    return src(SCHEMAS_GLOB).pipe(dest('../dist'));
}

function copyI18nMessages() {
    return src(MESSAGES_GLOB).pipe(dest('../dist/i18n/messages'));
}

export const build = parallel(copySchemas, copyI18nMessages);

export function watch() {
    const watcher1 = gulpWatch(SCHEMAS_GLOB, copySchemas);
    const watcher2 = gulpWatch(MESSAGES_GLOB, copyI18nMessages);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return new Promise(resolve => {});
}
