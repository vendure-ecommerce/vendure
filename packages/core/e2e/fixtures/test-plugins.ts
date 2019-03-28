import { Query, Resolver } from '@nestjs/graphql';
import gql from 'graphql-tag';

import { LanguageCode } from '../../../../shared/generated-types';
import { APIExtensionDefinition, InjectorFn, VendureConfig, VendurePlugin } from '../../src/config';
import { ConfigService } from '../../src/config/config.service';

export class TestAPIExtensionPlugin implements VendurePlugin {
    extendShopAPI(): APIExtensionDefinition {
        return {
            resolvers: [TestShopPluginResolver],
            schema: gql`
                extend type Query {
                    baz: [String]!
                }
            `,
        };
    }

    extendAdminAPI(): APIExtensionDefinition {
        return {
            resolvers: [TestAdminPluginResolver],
            schema: gql`
                extend type Query {
                    foo: [String]!
                }
            `,
        };
    }
}

@Resolver()
export class TestAdminPluginResolver {
    @Query()
    foo() {
        return ['bar'];
    }
}

@Resolver()
export class TestShopPluginResolver {
    @Query()
    baz() {
        return ['quux'];
    }
}

export class TestPluginWithProvider implements VendurePlugin {
    extendShopAPI(): APIExtensionDefinition {
        return {
            resolvers: [TestResolverWithInjection],
            schema: gql`
                extend type Query {
                    names: [String]!
                }
            `,
        };
    }

    defineProviders() {
        return [NameService];
    }
}

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

export class TestPluginWithConfigAndBootstrap implements VendurePlugin {
    constructor(private boostrapWasCalled: (arg: any) => void) {}

    configure(config: Required<VendureConfig>): Required<VendureConfig> {
        // tslint:disable-next-line:no-non-null-assertion
        config.defaultLanguageCode = LanguageCode.zh;
        return config;
    }

    onBootstrap(inject: InjectorFn) {
        const configService = inject(ConfigService);
        this.boostrapWasCalled(configService);
    }
}

export class TestPluginWithOnClose implements VendurePlugin {
    constructor(private onCloseCallback: () => void) {}
    onClose() {
        this.onCloseCallback();
    }
}
