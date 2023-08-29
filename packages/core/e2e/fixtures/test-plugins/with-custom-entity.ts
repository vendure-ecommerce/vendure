import { Collection, PluginCommonModule, VendureEntity, VendurePlugin } from '@vendure/core';
import gql from 'graphql-tag';
import { DeepPartial, Entity, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class TestCustomEntity extends VendureEntity {
    constructor(input?: DeepPartial<TestCustomEntity>) {
        super(input);
    }

    @ManyToMany(() => Collection, x => (x as any).customFields?.customEntityList, {
        eager: true,
    })
    customEntityListInverse: Collection[];

    @OneToMany(() => Collection, (a: Collection) => (a.customFields as any).customEntity)
    customEntityInverse: Collection[];
}

@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [TestCustomEntity],
    adminApiExtensions: {
        schema: gql`
            type TestCustomEntity {
                id: ID!
            }
        `,
    },
    configuration: config => {
        config.customFields = {
            ...(config.customFields ?? {}),
            Collection: [
                ...(config.customFields?.Collection ?? []),
                {
                    name: 'customEntity',
                    type: 'relation',
                    entity: TestCustomEntity,
                    list: false,
                    public: false,
                    inverseSide: (t: TestCustomEntity) => t.customEntityInverse,
                    graphQLType: 'TestCustomEntity',
                },
                {
                    name: 'customEntityList',
                    type: 'relation',
                    entity: TestCustomEntity,
                    list: true,
                    public: false,
                    inverseSide: (t: TestCustomEntity) => t.customEntityListInverse,
                    graphQLType: 'TestCustomEntity',
                },
            ],
        };
        return config;
    },
})
export class WithCustomEntity {}
