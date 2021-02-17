import { LanguageCode } from '@vendure/common/lib/generated-types';
import {
    ConfigModule,
    ConfigService,
    OnVendureBootstrap,
    OnVendureClose,
    VendurePlugin,
} from '@vendure/core';

@VendurePlugin({
    imports: [ConfigModule],
    configuration: config => {
        // tslint:disable-next-line:no-non-null-assertion
        config.defaultLanguageCode = LanguageCode.zh;
        return config;
    },
})
export class TestPluginWithConfig {
    static setup() {
        return TestPluginWithConfig;
    }
}
