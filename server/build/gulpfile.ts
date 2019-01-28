import { exec } from 'child_process';
import { dest, parallel, series, src } from 'gulp';
import path from 'path';

// tslint:disable:no-console

function copySchemas() {
    return src(['../src/**/*.graphql']).pipe(dest('../dist/server/src'));
}

function copyEmailTemplates() {
    return src(['../src/email/templates/**/*']).pipe(dest('../dist/cli/assets/email-templates'));
}

function copyCliAssets() {
    return src(['../cli/assets/**/*']).pipe(dest('../dist/cli/assets'));
}

function copyCliImages() {
    return src(['../mock-data/assets/**/*']).pipe(dest('../dist/cli/assets/images'));
}

function buildAdminUi() {
    return exec(
        'yarn build --prod=true',
        {
            cwd: path.join(__dirname, '../../admin-ui'),
        },
        error => {
            if (error) {
                console.log(error);
            }
        },
    );
}

function copyAdminUi() {
    return src(['../../admin-ui/dist/vendure-admin/**/*']).pipe(dest('../dist/admin-ui'));
}

function buildAndCopyAdminUi() {
    return src(['../mock-data/assets/**/*']).pipe(dest('../dist/cli/assets/images'));
}

export const build = parallel(
    copySchemas,
    copyEmailTemplates,
    copyCliAssets,
    copyCliImages,
    series(buildAdminUi, copyAdminUi),
);
