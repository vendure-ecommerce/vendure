import { LanguageCode } from '@vendure/common/lib/generated-types';
import { ConfigModule, VendurePlugin } from '@vendure/core';

@VendurePlugin({
    imports: [ConfigModule],
    configuration: config => {
        // tslint:disable-next-line:no-non-null-assertion
        config.defaultLanguageCode = LanguageCode.zh;
        TestPluginWithConfig.configSpy();
        return config;
    },
})
export class TestPluginWithConfig {
    static configSpy = jest.fn();
    static setup() {
        return TestPluginWithConfig;
    }
}
