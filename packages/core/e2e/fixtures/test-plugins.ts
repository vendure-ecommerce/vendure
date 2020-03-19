import { Controller, Get, Injectable } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { Permission } from '@vendure/common/lib/generated-shop-types';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import {
    Allow,
    ConfigModule,
    ConfigService,
    InternalServerError,
    OnVendureBootstrap,
    OnVendureClose,
    OnVendureWorkerBootstrap,
    OnVendureWorkerClose,
    VendurePlugin,
} from '@vendure/core';
import gql from 'graphql-tag';

export class TestPluginWithAllLifecycleHooks
    implements OnVendureBootstrap, OnVendureWorkerBootstrap, OnVendureClose, OnVendureWorkerClose {
    private static onConstructorFn: any;
    private static onBootstrapFn: any;
    private static onWorkerBootstrapFn: any;
    private static onCloseFn: any;
    private static onWorkerCloseFn: any;
    static init(
        constructorFn: any,
        bootstrapFn: any,
        workerBootstrapFn: any,
        closeFn: any,
        workerCloseFn: any,
    ) {
        this.onConstructorFn = constructorFn;
        this.onBootstrapFn = bootstrapFn;
        this.onWorkerBootstrapFn = workerBootstrapFn;
        this.onCloseFn = closeFn;
        this.onWorkerCloseFn = workerCloseFn;
        return this;
    }
    constructor() {
        TestPluginWithAllLifecycleHooks.onConstructorFn();
    }
    onVendureBootstrap(): void | Promise<void> {
        TestPluginWithAllLifecycleHooks.onBootstrapFn();
    }
    onVendureWorkerBootstrap(): void | Promise<void> {
        TestPluginWithAllLifecycleHooks.onWorkerBootstrapFn();
    }
    onVendureClose(): void | Promise<void> {
        TestPluginWithAllLifecycleHooks.onCloseFn();
        this.resetSpies();
    }
    onVendureWorkerClose(): void | Promise<void> {
        TestPluginWithAllLifecycleHooks.onWorkerCloseFn();
        this.resetSpies();
    }

    /**
     * This is required because on the first run, the Vendure server will be bootstrapped twice -
     * once to populate the database and the second time forthe actual tests. Thus the call counts
     * for the plugin lifecycles will be doubled. This method resets them after the initial
     * (population) run.
     */
    private resetSpies() {
        TestPluginWithAllLifecycleHooks.onConstructorFn.mockClear();
        TestPluginWithAllLifecycleHooks.onBootstrapFn.mockClear();
        TestPluginWithAllLifecycleHooks.onWorkerBootstrapFn.mockClear();
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

@Resolver()
export class TestLazyResolver {
    @Query()
    lazy() {
        return 'sleeping';
    }
}

@VendurePlugin({
    shopApiExtensions: {
        resolvers: () => [TestLazyResolver],
        schema: () => gql`
            extend type Query {
                lazy: String!
            }
        `,
    },
})
export class TestLazyExtensionPlugin {}

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

@Controller('test')
export class TestController {
    @Get('public')
    publicRoute() {
        return 'success';
    }

    @Allow(Permission.Authenticated)
    @Get('restricted')
    restrictedRoute() {
        return 'success';
    }

    @Get('bad')
    badRoute() {
        throw new InternalServerError('uh oh!');
    }
}

@VendurePlugin({
    controllers: [TestController],
})
export class TestRestPlugin {}
