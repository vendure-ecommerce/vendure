import { Args, Query, Resolver } from '@nestjs/graphql';
import { InjectConnection } from '@nestjs/typeorm';
import {
    ListQueryBuilder,
    OnVendureBootstrap,
    PluginCommonModule,
    VendureEntity,
    VendurePlugin,
} from '@vendure/core';
import gql from 'graphql-tag';
import { Column, Connection, Entity } from 'typeorm';

@Entity()
export class TestEntity extends VendureEntity {
    constructor(input: Partial<TestEntity>) {
        super(input);
    }
    @Column()
    label: string;

    @Column()
    date: Date;
}

@Resolver()
export class ListQueryResolver {
    constructor(private listQueryBuilder: ListQueryBuilder) {}

    @Query()
    testEntities(@Args() args: any) {
        return this.listQueryBuilder
            .build(TestEntity, args.options)
            .getManyAndCount()
            .then(([items, totalItems]) => {
                return {
                    items,
                    totalItems,
                };
            });
    }
}

const adminApiExtensions = gql`
    type TestEntity implements Node {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        label: String!
        date: DateTime!
    }

    type TestEntityList implements PaginatedList {
        totalItems: Int!
        items: [TestEntity!]!
    }

    extend type Query {
        testEntities(options: TestEntityListOptions): TestEntityList!
    }

    input TestEntityListOptions
`;

@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [TestEntity],
    adminApiExtensions: {
        schema: adminApiExtensions,
        resolvers: [ListQueryResolver],
    },
})
export class ListQueryPlugin implements OnVendureBootstrap {
    constructor(@InjectConnection() private connection: Connection) {}

    async onVendureBootstrap() {
        const count = await this.connection.getRepository(TestEntity).count();
        if (count === 0) {
            await this.connection
                .getRepository(TestEntity)
                .save([
                    new TestEntity({ label: 'A', date: new Date('2020-01-05T10:00:00.000Z') }),
                    new TestEntity({ label: 'B', date: new Date('2020-01-15T10:00:00.000Z') }),
                    new TestEntity({ label: 'C', date: new Date('2020-01-25T10:00:00.000Z') }),
                ]);
        }
    }
}
