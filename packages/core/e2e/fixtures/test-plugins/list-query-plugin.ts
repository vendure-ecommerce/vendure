import { Args, Query, Resolver } from '@nestjs/graphql';
import {
    ListQueryBuilder,
    OnVendureBootstrap,
    PluginCommonModule,
    TransactionalConnection,
    VendureEntity,
    VendurePlugin,
} from '@vendure/core';
import gql from 'graphql-tag';
import { Column, Entity } from 'typeorm';

@Entity()
export class TestEntity extends VendureEntity {
    constructor(input: Partial<TestEntity>) {
        super(input);
    }
    @Column()
    label: string;

    @Column()
    description: string;

    @Column()
    active: boolean;

    @Column()
    order: number;

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
        description: String!
        active: Boolean!
        order: Int!
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
    constructor(private connection: TransactionalConnection) {}

    async onVendureBootstrap() {
        const count = await this.connection.getRepository(TestEntity).count();
        if (count === 0) {
            await this.connection.getRepository(TestEntity).save([
                new TestEntity({
                    label: 'A',
                    description: 'Lorem ipsum',
                    date: new Date('2020-01-05T10:00:00.000Z'),
                    active: true,
                    order: 0,
                }),
                new TestEntity({
                    label: 'B',
                    description: 'dolor sit',
                    date: new Date('2020-01-15T10:00:00.000Z'),
                    active: true,
                    order: 1,
                }),
                new TestEntity({
                    label: 'C',
                    description: 'consectetur adipiscing',
                    date: new Date('2020-01-25T10:00:00.000Z'),
                    active: false,
                    order: 2,
                }),
                new TestEntity({
                    label: 'D',
                    description: 'eiusmod tempor',
                    date: new Date('2020-01-30T10:00:00.000Z'),
                    active: true,
                    order: 3,
                }),
                new TestEntity({
                    label: 'E',
                    description: 'incididunt ut',
                    date: new Date('2020-02-05T10:00:00.000Z'),
                    active: false,
                    order: 4,
                }),
            ]);
        }
    }
}
