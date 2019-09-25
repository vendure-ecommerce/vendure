import { AdminUiExtension } from '@vendure/common/lib/shared-types';
import { VendurePlugin } from '@vendure/core';
import path from 'path';

@VendurePlugin({})
export class UiPlugin {
    static uiExtensions: AdminUiExtension[] = [
        {
            type: 'lazy',
            ngModulePath: path.join(__dirname, 'lazy-module'),
            ngModuleFileName: 'ui-plugin.module.ts',
            ngModuleName: 'TestModule',
        },
        {
            type: 'shared',
            ngModulePath: path.join(__dirname, 'shared-module'),
            ngModuleFileName: 'ui-shared-plugin.module.ts',
            ngModuleName: 'TestSharedModule',
        },
    ];
}
