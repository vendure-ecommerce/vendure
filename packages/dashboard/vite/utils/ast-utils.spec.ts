import ts from 'typescript';
import { describe, expect, it } from 'vitest';

import { findConfigExport } from './ast-utils.js';

// describe('getPluginInfo', () => {
//     it('should return undefined when no plugin class is found', () => {
//         const sourceText = `
//             class NotAPlugin {
//                 constructor() {}
//             }
//         `;
//         const sourceFile = ts.createSourceFile('path/to/test.ts', sourceText, ts.ScriptTarget.Latest, true);
//         const result = getPluginInfo(sourceFile);
//         expect(result).toBeUndefined();
//     });
//
//     it('should return plugin info when a valid plugin class is found', () => {
//         const sourceText = `
//             @VendurePlugin({
//                 imports: [],
//                 providers: []
//             })
//             class TestPlugin {
//                 constructor() {}
//             }
//         `;
//         const sourceFile = ts.createSourceFile('path/to/test.ts', sourceText, ts.ScriptTarget.Latest, true);
//         const result = getPluginInfo(sourceFile);
//         expect(result).toEqual({
//             name: 'TestPlugin',
//             pluginPath: 'path/to',
//             dashboardEntryPath: undefined,
//         });
//     });
//
//     it('should handle multiple classes but only return the plugin one', () => {
//         const sourceText = `
//             class NotAPlugin {
//                 constructor() {}
//             }
//
//             @VendurePlugin({
//                 imports: [],
//                 providers: []
//             })
//             class TestPlugin {
//                 constructor() {}
//             }
//
//             class AnotherClass {
//                 constructor() {}
//             }
//         `;
//         const sourceFile = ts.createSourceFile('path/to/test.ts', sourceText, ts.ScriptTarget.Latest, true);
//         const result = getPluginInfo(sourceFile);
//         expect(result).toEqual({
//             name: 'TestPlugin',
//             pluginPath: 'path/to',
//             dashboardEntryPath: undefined,
//         });
//     });
//
//     it('should determine the dashboard entry path when it is provided', () => {
//         const sourceText = `
//             @VendurePlugin({
//                 imports: [],
//                 providers: [],
//                 dashboard: './dashboard/index.tsx',
//             })
//             class TestPlugin {
//                 constructor() {}
//             }
//         `;
//         const sourceFile = ts.createSourceFile('path/to/test.ts', sourceText, ts.ScriptTarget.Latest, true);
//         const result = getPluginInfo(sourceFile);
//         expect(result).toEqual({
//             name: 'TestPlugin',
//             pluginPath: 'path/to',
//             dashboardEntryPath: './dashboard/index.tsx',
//         });
//     });
// });

describe('findConfigExport', () => {
    it('should return undefined when no VendureConfig export is found', () => {
        const sourceText = `
            export const notConfig = {
                some: 'value'
            };
        `;
        const sourceFile = ts.createSourceFile('path/to/test.ts', sourceText, ts.ScriptTarget.Latest, true);
        const result = findConfigExport(sourceFile);
        expect(result).toBeUndefined();
    });

    it('should find exported variable with VendureConfig type', () => {
        const sourceText = `
            import { VendureConfig } from '@vendure/core';

            export const config: VendureConfig = {
                authOptions: {
                    tokenMethod: 'bearer'
                }
            };
        `;
        const sourceFile = ts.createSourceFile('path/to/test.ts', sourceText, ts.ScriptTarget.Latest, true);
        const result = findConfigExport(sourceFile);
        expect(result).toBe('config');
    });

    it('should find exported variable with VendureConfig type among other exports', () => {
        const sourceText = `
            import { VendureConfig } from '@vendure/core';

            export const otherExport = 'value';
            export const config: VendureConfig = {
                authOptions: {
                    tokenMethod: 'bearer'
                }
            };
            export const anotherExport = 123;
        `;
        const sourceFile = ts.createSourceFile('path/to/test.ts', sourceText, ts.ScriptTarget.Latest, true);
        const result = findConfigExport(sourceFile);
        expect(result).toBe('config');
    });
});
