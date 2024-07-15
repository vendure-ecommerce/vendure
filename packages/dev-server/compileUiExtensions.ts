import { compileUiExtensions } from '@vendure/ui-devkit/compiler';
import path from 'path';
import { ReviewsPlugin } from './test-plugins/reviews/reviews-plugin';

void compileUiExtensions({
    ngCompilerPath: path.join(__dirname, '../../node_modules/@angular/cli/bin/ng.js'),
    outputPath: path.join(__dirname, './custom-admin-ui'),
    extensions: [
        {
            id: 'greeter',
            extensionPath: path.join(__dirname, 'test-plugins/with-ui-extension/ui'),
            ngModules: [
                {
                    type: 'lazy',
                    route: 'greetz',
                    ngModuleFileName: 'greeter.module.ts',
                    ngModuleName: 'GreeterModule',
                },
                {
                    type: 'shared',
                    ngModuleFileName: 'greeter-shared.module.ts',
                    ngModuleName: 'GreeterSharedModule',
                },
            ],
            routes: [{}],
        },
        ReviewsPlugin.uiExtensions,
    ],
}).compile?.();
