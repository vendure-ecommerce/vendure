import { note } from '@clack/prompts';
import spawn from 'cross-spawn';
import fs from 'fs-extra';
import path from 'path';

import { Logger } from './logger';

export interface PackageToInstall {
    pkg: string;
    version?: string;
    isDevDependency?: boolean;
}

export function determineVendureVersion(): string | undefined {
    const packageJson = getPackageJsonContent();
    return packageJson.dependencies['@vendure/core'];
}

export async function installRequiredPackages(requiredPackages: PackageToInstall[]) {
    const packageJson = getPackageJsonContent();
    const packagesToInstall = requiredPackages.filter(({ pkg, version, isDevDependency }) => {
        const hasDependency = isDevDependency
            ? packageJson.devDependencies[pkg]
            : packageJson.dependencies[pkg];
        return !hasDependency;
    });

    const depsToInstall = packagesToInstall
        .filter(p => !p.isDevDependency)
        .map(p => `${p.pkg}${p.version ? `@${p.version}` : ''}`);
    const devDepsToInstall = packagesToInstall
        .filter(p => p.isDevDependency)
        .map(p => `${p.pkg}${p.version ? `@${p.version}` : ''}`);
    if (depsToInstall.length) {
        await installPackages(depsToInstall, false);
    }
    if (devDepsToInstall.length) {
        await installPackages(devDepsToInstall, true);
    }
}

export async function installPackages(dependencies: string[], isDev: boolean) {
    return new Promise<void>((resolve, reject) => {
        const packageManager = determinePackageManagerBasedOnLockFile();
        let command = '';
        let args: string[] = [];
        if (packageManager === 'yarn') {
            command = 'yarnpkg';
            args = ['add', '--exact', '--ignore-engines'];
            if (isDev) {
                args.push('--dev');
            }

            args = args.concat(dependencies);
        } else {
            command = 'npm';
            args = ['install', '--save', '--save-exact', '--loglevel', 'error'].concat(dependencies);
            if (isDev) {
                args.push('--save-dev');
            }
        }
        const child = spawn(command, args, { stdio: Logger.logLevel === 'verbose' ? 'inherit' : 'ignore' });
        child.on('close', code => {
            if (code !== 0) {
                const message = 'An error occurred when installing dependencies.';
                reject({
                    message,
                    command: `${command} ${args.join(' ')}`,
                });
                return;
            }
            resolve();
        });
    });
}

function determinePackageManagerBasedOnLockFile(): 'yarn' | 'npm' | 'pnpm' {
    const yarnLockPath = path.join(process.cwd(), 'yarn.lock');
    const npmLockPath = path.join(process.cwd(), 'package-lock.json');
    const pnpmLockPath = path.join(process.cwd(), 'pnpm-lock.yaml');
    if (fs.existsSync(yarnLockPath)) {
        return 'yarn';
    }
    if (fs.existsSync(npmLockPath)) {
        return 'npm';
    }
    if (fs.existsSync(pnpmLockPath)) {
        return 'pnpm';
    }
    return 'npm';
}

function getPackageJsonContent() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        note(
            `Could not find a package.json in the current directory. Please run this command from the root of a Vendure project.`,
        );
        return false;
    }
    return fs.readJsonSync(packageJsonPath);
}
