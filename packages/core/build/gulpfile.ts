import { exec } from 'child_process';
import fs from 'fs-extra';
import { dest, parallel, series, src } from 'gulp';
import path from 'path';

function copySchemas() {
    return src(['../src/**/*.graphql']).pipe(dest('../dist'));
}

function copyI18nMessages() {
    return src(['../src/i18n/messages/**/*']).pipe(dest('../dist/i18n/messages'));
}

export const build = parallel(
    copySchemas,
    copyI18nMessages,
);
