import { log } from '@clack/prompts';
import { generateMigration, revertLastMigration, runMigrations, VendureConfig } from '@vendure/core';
import * as fs from 'fs-extra';
import path from 'path';

import { analyzeProject } from '../../shared/shared-prompts';
import { VendureConfigRef } from '../../shared/vendure-config-ref';

import { loadVendureConfigFile } from './load-vendure-config-file';

export interface MigrationOptions {
    name?: string;
    outputDir?: string;
}

export interface MigrationResult {
    success: boolean;
    message: string;
    migrationName?: string;
    migrationsRan?: string[];
}

/**
 * Generates a new database migration for a Vendure project.
 *
 * Validates the project directory, migration name, and determines the appropriate output directory before generating the migration. Returns the result indicating success, a descriptive message, and the migration name if generated.
 *
 * @param options - Options to specify the migration name and output directory.
 * @returns The result of the migration generation, including success status, message, and the migration name if applicable.
 */
export async function generateMigrationOperation(options: MigrationOptions = {}): Promise<MigrationResult> {
    try {
        // Check if we're in a proper Vendure project directory
        if (!isVendureProjectDirectory()) {
            return {
                success: false,
                message:
                    'Error: Not in a Vendure project directory. Please run this command from your Vendure project root.',
            };
        }

        const { project, tsConfigPath } = await analyzeProject({ cancelledMessage: '' });
        const vendureConfig = new VendureConfigRef(project);
        log.info('Using VendureConfig from ' + vendureConfig.getPathRelativeToProjectRoot());

        const name = options.name;
        if (!name) {
            return {
                success: false,
                message: 'Migration name is required',
            };
        }

        // Validate name
        if (!/^[a-zA-Z][a-zA-Z-_0-9]+$/.test(name)) {
            return {
                success: false,
                message: 'The migration name must contain only letters, numbers, underscores and dashes',
            };
        }

        const config = await loadVendureConfigFile(vendureConfig, tsConfigPath);
        const migrationsDirs = getMigrationsDir(vendureConfig, config);
        const migrationDir = options.outputDir || migrationsDirs[0];

        log.info('Generating migration...');
        const migrationName = await generateMigration(config, { name, outputDir: migrationDir });

        const report =
            typeof migrationName === 'string'
                ? `New migration generated: ${migrationName}`
                : 'No changes in database schema were found, so no migration was generated';

        return {
            success: true,
            message: report,
            migrationName: typeof migrationName === 'string' ? migrationName : undefined,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Failed to generate migration',
        };
    }
}

/**
 * Executes all pending database migrations for the current Vendure project.
 *
 * @returns The result of the migration operation, including success status, a descriptive message, and a list of migrations that were run if applicable.
 */
export async function runMigrationsOperation(): Promise<MigrationResult> {
    try {
        // Check if we're in a proper Vendure project directory
        if (!isVendureProjectDirectory()) {
            return {
                success: false,
                message:
                    'Error: Not in a Vendure project directory. Please run this command from your Vendure project root.',
            };
        }

        const { project } = await analyzeProject({ cancelledMessage: '' });
        const vendureConfig = new VendureConfigRef(project);
        log.info('Using VendureConfig from ' + vendureConfig.getPathRelativeToProjectRoot());
        const config = await loadVendureConfigFile(vendureConfig);

        log.info('Running migrations...');
        const migrationsRan = await runMigrations(config);

        const report = migrationsRan.length
            ? `Successfully ran ${migrationsRan.length} migrations`
            : 'No pending migrations found';

        return {
            success: true,
            message: report,
            migrationsRan,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Failed to run migrations',
        };
    }
}

/**
 * Reverts the most recently applied database migration in the current Vendure project.
 *
 * @returns The result of the revert operation, including success status and a descriptive message.
 */
export async function revertMigrationOperation(): Promise<MigrationResult> {
    try {
        // Check if we're in a proper Vendure project directory
        if (!isVendureProjectDirectory()) {
            return {
                success: false,
                message:
                    'Error: Not in a Vendure project directory. Please run this command from your Vendure project root.',
            };
        }

        const { project } = await analyzeProject({ cancelledMessage: '' });
        const vendureConfig = new VendureConfigRef(project);
        log.info('Using VendureConfig from ' + vendureConfig.getPathRelativeToProjectRoot());
        const config = await loadVendureConfigFile(vendureConfig);

        log.info('Reverting last migration...');
        await revertLastMigration(config);

        return {
            success: true,
            message: 'Successfully reverted last migration',
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Failed to revert migration',
        };
    }
}

/**
 * Determines whether the current working directory is a Vendure project.
 *
 * Checks for the presence of Vendure configuration files and Vendure dependencies in `package.json`.
 *
 * @returns `true` if the directory appears to be a Vendure project; otherwise, `false`.
 */
function isVendureProjectDirectory(): boolean {
    const cwd = process.cwd();

    // Check for common Vendure project files
    const hasPackageJson = fs.existsSync(path.join(cwd, 'package.json'));
    const hasVendureConfig =
        fs.existsSync(path.join(cwd, 'vendure-config.ts')) ||
        fs.existsSync(path.join(cwd, 'vendure-config.js')) ||
        fs.existsSync(path.join(cwd, 'src/vendure-config.ts')) ||
        fs.existsSync(path.join(cwd, 'src/vendure-config.js'));

    // Check if package.json contains Vendure dependencies
    if (hasPackageJson) {
        try {
            const packageJson = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf-8'));
            const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
            const hasVendureDeps = Object.keys(dependencies).some(
                dep => dep.includes('@vendure/') || dep === 'vendure',
            );

            return hasVendureDeps && hasVendureConfig;
        } catch {
            return false;
        }
    }

    return false;
}

/**
 * Returns possible directories where migration files may be located for the given Vendure configuration.
 *
 * The returned array includes directories derived from the migration paths in the configuration, any source file containing a class implementing `MigrationInterface`, and a default `../migrations` directory relative to the Vendure config file.
 *
 * @returns An array of normalized directory paths that may contain migration files.
 */
function getMigrationsDir(vendureConfigRef: VendureConfigRef, config: VendureConfig): string[] {
    const options: string[] = [];
    if (
        Array.isArray(config.dbConnectionOptions.migrations) &&
        config.dbConnectionOptions.migrations.length
    ) {
        const firstEntry = config.dbConnectionOptions.migrations[0];
        if (typeof firstEntry === 'string') {
            options.push(path.dirname(firstEntry));
        }
    }
    const migrationFile = vendureConfigRef.sourceFile
        .getProject()
        .getSourceFiles()
        .find(sf => {
            return sf
                .getClasses()
                .find(c => c.getImplements().find(i => i.getText() === 'MigrationInterface'));
        });
    if (migrationFile) {
        options.push(migrationFile.getDirectory().getPath());
    }
    options.push(path.join(vendureConfigRef.sourceFile.getDirectory().getPath(), '../migrations'));
    return options.map(p => path.normalize(p));
}
