import { Injectable, OnApplicationBootstrap, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import gql from 'graphql-tag';

import { VendureConfig } from '../../src/config';
import { ConfigModule } from '../../src/config/config.module';
import { ConfigService } from '../../src/config/config.service';
import {
    OnVendureBootstrap,
    OnVendureClose,
    OnVendureWorkerBootstrap,
    OnVendureWorkerClose,
    VendurePlugin,
} from '../../src/plugin/vendure-plugin';

export class TestPluginWithAllLifecycleHooks
    implements OnVendureBootstrap, OnVendureWorkerBootstrap, OnVendureClose, OnVendureWorkerClose {
    private static onBootstrapFn: any;
    private static onWorkerBootstrapFn: any;
    private static onCloseFn: any;
    private static onWorkerCloseFn: any;
    static init(bootstrapFn: any, workerBootstrapFn: any, closeFn: any, workerCloseFn: any) {
        this.onBootstrapFn = bootstrapFn;
        this.onWorkerBootstrapFn = workerBootstrapFn;
        this.onCloseFn = closeFn;
        this.onWorkerCloseFn = workerCloseFn;
        return this;
    }
    onVendureBootstrap(): void | Promise<void> {
        TestPluginWithAllLifecycleHooks.onBootstrapFn();
    }
    onVendureWorkerBootstrap(): void | Promise<void> {
        TestPluginWithAllLifecycleHooks.onWorkerBootstrapFn();
    }
    onVendureClose(): void | Promise<void> {
        TestPluginWithAllLifecycleHooks.onCloseFn();
    }
    onVendureWorkerClose(): void | Promise<void> {
        TestPluginWithAllLifecycleHooks.onWorkerCloseFn();
    }
}

@Resolver()
export class TestAdminPluginResolver {
    @Query()
    foo() {
        return ['bar'];
    }

    @Query()
    barList() {
        return {
            items: [{ id: 1, name: 'Test' }],
            totalItems: 1,
        };
    }
}

@Resolver()
export class TestShopPluginResolver {
    @Query()
    baz() {
        return ['quux'];
    }
}

@VendurePlugin({
    shopApiExtensions: {
        resolvers: [TestShopPluginResolver],
        schema: gql`
            extend type Query {
                baz: [String]!
            }
        `,
    },
    adminApiExtensions: {
        resolvers: [TestAdminPluginResolver],
        schema: gql`
            extend type Query {
                foo: [String]!
                barList(options: BarListOptions): BarList!
            }

            input BarListOptions
            type Bar implements Node {
                id: ID!
                name: String!
            }
            type BarList implements PaginatedList {
                items: [Bar!]!
                totalItems: Int!
            }
        `,
    },
})
export class TestAPIExtensionPlugin {}

@Injectable()
export class NameService {
    getNames(): string[] {
        return ['seon', 'linda', 'hong'];
    }
}

@Resolver()
export class TestResolverWithInjection {
    constructor(private nameService: NameService) {}

    @Query()
    names() {
        return this.nameService.getNames();
    }
}

@VendurePlugin({
    providers: [NameService],
    shopApiExtensions: {
        resolvers: [TestResolverWithInjection],
        schema: gql`
            extend type Query {
                names: [String]!
            }
        `,
    },
})
export class TestPluginWithProvider {}

@VendurePlugin({
    imports: [ConfigModule],
    configuration: config => {
        // tslint:disable-next-line:no-non-null-assertion
        config.defaultLanguageCode = LanguageCode.zh;
        return config;
    },
})
export class TestPluginWithConfigAndBootstrap implements OnVendureBootstrap {
    private static boostrapWasCalled: any;
    static setup(boostrapWasCalled: (arg: any) => void) {
        TestPluginWithConfigAndBootstrap.boostrapWasCalled = boostrapWasCalled;
        return TestPluginWithConfigAndBootstrap;
    }
    constructor(private configService: ConfigService) {}

    onVendureBootstrap() {
        TestPluginWithConfigAndBootstrap.boostrapWasCalled(this.configService);
    }
}
