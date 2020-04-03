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
    configuration: (config) => {
        // tslint:disable-next-line:no-non-null-assertion
        config.defaultLanguageCode = LanguageCode.zh;
        return config;
    },
})
export class TestPluginWithConfigAndBootstrap implements OnVendureBootstrap, OnVendureClose {
    private static boostrapWasCalled: any;

    static setup(boostrapWasCalled: (arg: any) => void) {
        TestPluginWithConfigAndBootstrap.boostrapWasCalled = boostrapWasCalled;
        return TestPluginWithConfigAndBootstrap;
    }

    constructor(private configService: ConfigService) {}

    onVendureBootstrap() {
        TestPluginWithConfigAndBootstrap.boostrapWasCalled(this.configService);
    }

    onVendureClose() {
        TestPluginWithConfigAndBootstrap.boostrapWasCalled.mockClear();
    }
}
