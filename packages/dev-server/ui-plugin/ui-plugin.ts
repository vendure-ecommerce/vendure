import { AdminUiExtension } from '@vendure/common/lib/shared-types';
import { VendurePlugin } from '@vendure/core';
import path from 'path';

@VendurePlugin({})
export class UiPlugin {
    static uiExtensions: AdminUiExtension[] = [
        {
            extensionPath: path.join(__dirname, 'extensions'),
            ngModules: [
                {
                    type: 'lazy',
                    ngModuleFileName: 'ui-plugin.module.ts',
                    ngModuleName: 'TestModule',
                },
                {
                    type: 'shared',
                    ngModuleFileName: 'ui-shared-plugin.module.ts',
                    ngModuleName: 'TestSharedModule',
                },
            ],
        },
    ];
}
