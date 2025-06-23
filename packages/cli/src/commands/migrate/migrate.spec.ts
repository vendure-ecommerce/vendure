/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { beforeEach, describe, expect, it } from 'vitest';

import { MigrateOptions } from './migrate';

describe('MigrateOptions interface', () => {
    let defaultOptions: MigrateOptions;

    beforeEach(() => {
        defaultOptions = {
            generate: undefined,
            run: undefined,
            revert: undefined,
            outputDir: undefined,
        };
    });

    describe('Interface structure validation', () => {
        it('Accepts valid MigrateOptions with all properties', () => {
            const options: MigrateOptions = {
                generate: 'test-migration',
                run: true,
                revert: false,
                outputDir: './migrations',
            };

            expect(options).toBeDefined();
            expect(typeof options.generate).toBe('string');
            expect(typeof options.run).toBe('boolean');
            expect(typeof options.revert).toBe('boolean');
            expect(typeof options.outputDir).toBe('string');
        });

        it('Accepts empty MigrateOptions', () => {
            const options: MigrateOptions = {};

            expect(options).toBeDefined();
            expect(options.generate).toBeUndefined();
            expect(options.run).toBeUndefined();
            expect(options.revert).toBeUndefined();
            expect(options.outputDir).toBeUndefined();
        });

        it('Accepts MigrateOptions with only generate property', () => {
            const options: MigrateOptions = {
                generate: 'test-migration-name',
            };

            expect(options).toBeDefined();
            expect(options.generate).toBe('test-migration-name');
            expect(options.run).toBeUndefined();
            expect(options.revert).toBeUndefined();
            expect(options.outputDir).toBeUndefined();
        });

        it('Accepts MigrateOptions with only run property', () => {
            const options: MigrateOptions = {
                run: true,
            };

            expect(options).toBeDefined();
            expect(options.generate).toBeUndefined();
            expect(options.run).toBe(true);
            expect(options.revert).toBeUndefined();
            expect(options.outputDir).toBeUndefined();
        });

        it('Accepts MigrateOptions with only revert property', () => {
            const options: MigrateOptions = {
                revert: true,
            };

            expect(options).toBeDefined();
            expect(options.generate).toBeUndefined();
            expect(options.run).toBeUndefined();
            expect(options.revert).toBe(true);
            expect(options.outputDir).toBeUndefined();
        });

        it('Accepts MigrateOptions with only outputDir property', () => {
            const options: MigrateOptions = {
                outputDir: './custom-migrations',
            };

            expect(options).toBeDefined();
            expect(options.generate).toBeUndefined();
            expect(options.run).toBeUndefined();
            expect(options.revert).toBeUndefined();
            expect(options.outputDir).toBe('./custom-migrations');
        });

        it('Accepts MigrateOptions with generate and outputDir', () => {
            const options: MigrateOptions = {
                generate: 'test-migration',
                outputDir: './custom-output',
            };

            expect(options).toBeDefined();
            expect(options.generate).toBe('test-migration');
            expect(options.run).toBeUndefined();
            expect(options.revert).toBeUndefined();
            expect(options.outputDir).toBe('./custom-output');
        });

        it('Accepts MigrateOptions with run and outputDir', () => {
            const options: MigrateOptions = {
                run: true,
                outputDir: './migrations',
            };

            expect(options).toBeDefined();
            expect(options.generate).toBeUndefined();
            expect(options.run).toBe(true);
            expect(options.revert).toBeUndefined();
            expect(options.outputDir).toBe('./migrations');
        });
    });

    describe('Property type validation', () => {
        function validateMigrateOptions(options: MigrateOptions) {
            expect(options).toBeDefined();

            if (options.generate !== undefined) {
                expect(typeof options.generate).toBe('string');
            }
            if (options.run !== undefined) {
                expect(typeof options.run).toBe('boolean');
            }
            if (options.revert !== undefined) {
                expect(typeof options.revert).toBe('boolean');
            }
            if (options.outputDir !== undefined) {
                expect(typeof options.outputDir).toBe('string');
            }
        }

        it('Validates options with all properties', () => {
            const options: MigrateOptions = {
                generate: 'migration-name',
                run: false,
                revert: true,
                outputDir: './test-dir',
            };

            validateMigrateOptions(options);
        });

        it('Validates options with mixed properties', () => {
            const optionsVariants: MigrateOptions[] = [
                { generate: 'test' },
                { run: true },
                { revert: false },
                { outputDir: './test' },
                { generate: 'test', outputDir: './output' },
                { run: true, outputDir: './output' },
                { generate: 'test', run: false },
                { revert: true, outputDir: './migrations' },
            ];

            optionsVariants.forEach(options => {
                validateMigrateOptions(options);
            });
        });
    });

    describe('Valid migration names', () => {
        it('Accepts valid migration name formats', () => {
            const validNames = [
                'testMigration',
                'test_migration',
                'test-migration',
                'TestMigration123',
                'migration1',
                'a',
                'A123_test-name',
                'addUserTable',
                'update_product_schema',
                'fix-payment-issue',
            ];

            validNames.forEach(name => {
                const options: MigrateOptions = { generate: name };
                expect(options.generate).toBe(name);
                expect(typeof options.generate).toBe('string');
            });
        });

        it('Stores migration names as strings', () => {
            const testNames = ['test1', 'test_2', 'test-3'];

            testNames.forEach(name => {
                const options: MigrateOptions = { generate: name };
                expect(typeof options.generate).toBe('string');
                expect(options.generate!.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Output directory handling', () => {
        it('Accepts various output directory formats', () => {
            const validPaths = [
                './migrations',
                '../migrations',
                '/absolute/path/migrations',
                'relative/path',
                '.',
                '..',
                './src/migrations',
                '../project/migrations',
            ];

            validPaths.forEach(path => {
                const options: MigrateOptions = { outputDir: path };
                expect(options.outputDir).toBe(path);
                expect(typeof options.outputDir).toBe('string');
            });
        });

        it('Combines generate and outputDir correctly', () => {
            const combinations = [
                { generate: 'test1', outputDir: './migrations' },
                { generate: 'test_2', outputDir: '../output' },
                { generate: 'test-3', outputDir: '/absolute/path' },
            ];

            combinations.forEach(combo => {
                const options: MigrateOptions = combo;
                expect(options.generate).toBe(combo.generate);
                expect(options.outputDir).toBe(combo.outputDir);
                expect(typeof options.generate).toBe('string');
                expect(typeof options.outputDir).toBe('string');
            });
        });
    });
});
