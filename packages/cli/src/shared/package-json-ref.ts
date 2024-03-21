import { note } from '@clack/prompts';
import spawn from 'cross-spawn';
import fs from 'fs-extra';
import path from 'path';
import { Project } from 'ts-morph';

export interface PackageToInstall {
    pkg: string;
    version?: string;
    isDevDependency?: boolean;
}

export class PackageJson {
    constructor(private readonly project: Project) {}

    determineVendureVersion(): string | undefined {
        const packageJson = this.getPackageJsonContent();
        return packageJson.dependencies['@vendure/core'];
    }

    async installPackages(requiredPackages: PackageToInstall[]) {
        const packageJson = this.getPackageJsonContent();
        const packagesToInstall = requiredPackages.filter(({ pkg, version, isDevDependency }) => {
            const hasDependency = isDevDependency
                ? packageJson.devDependencies[pkg]
                : packageJson.dependencies[pkg];
            return !hasDependency;
        });

        const depsToInstall = packagesToInstall
            .filter(p => !p.isDevDependency && packageJson.dependencies?.[p.pkg] === undefined)
            .map(p => `${p.pkg}${p.version ? `@${p.version}` : ''}`);
        const devDepsToInstall = packagesToInstall
            .filter(p => p.isDevDependency && packageJson.devDependencies?.[p.pkg] === undefined)
            .map(p => `${p.pkg}${p.version ? `@${p.version}` : ''}`);
        if (depsToInstall.length) {
            await this.runPackageManagerInstall(depsToInstall, false);
        }
        if (devDepsToInstall.length) {
            await this.runPackageManagerInstall(devDepsToInstall, true);
        }
    }

    getPackageJsonContent() {
        const packageJsonPath = path.join(this.getPackageRootDir().getPath(), 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            note(
                `Could not find a package.json in the current directory. Please run this command from the root of a Vendure project.`,
            );
            return false;
        }
        return fs.readJsonSync(packageJsonPath);
    }

    determinePackageManager(): 'yarn' | 'npm' | 'pnpm' {
        const rootDir = this.getPackageRootDir().getPath();
        const yarnLockPath = path.join(rootDir, 'yarn.lock');
        const npmLockPath = path.join(rootDir, 'package-lock.json');
        const pnpmLockPath = path.join(rootDir, 'pnpm-lock.yaml');
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

    addScript(scriptName: string, script: string) {
        const packageJson = this.getPackageJsonContent();
        packageJson.scripts = packageJson.scripts || {};
        packageJson.scripts[scriptName] = script;
        const rootDir = this.getPackageRootDir();
        const packageJsonPath = path.join(rootDir.getPath(), 'package.json');
        fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
    }

    getPackageRootDir() {
        const rootDir = this.project.getDirectory('.');
        if (!rootDir) {
            throw new Error('Could not find the root directory of the project');
        }
        return rootDir;
    }

    private async runPackageManagerInstall(dependencies: string[], isDev: boolean) {
        return new Promise<void>((resolve, reject) => {
            const packageManager = this.determinePackageManager();
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
            const child = spawn(command, args, { stdio: 'ignore' });
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
}
