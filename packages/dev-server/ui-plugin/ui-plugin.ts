import { AdminUiExtension } from '@vendure/common/lib/shared-types';
import { VendurePlugin } from '@vendure/core';
import path from 'path';

@VendurePlugin({})
export class UiPlugin {
    static uiExtensions: AdminUiExtension[] = [
        {
            ngModulePath: path.join(__dirname, 'module'),
            ngModuleFileName: 'ui-plugin.module.ts',
            ngModuleName: 'TestModule',
        },
    ];
}
